const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { Pool } = require("pg");
const app = express();
const pool = process.env.DATABASE_URL ? new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:true},max:5}) : null;
const origins=(process.env.CORS_ORIGIN||"").split(",").map(x=>x.trim()).filter(Boolean);
app.disable("x-powered-by");
app.use(cors({origin:(origin,cb)=>cb(null,!origin||origins.includes(origin))}));
app.use(express.json({limit:"64kb"}));
app.use((req,res,next)=>{res.set({"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"no-referrer"});next()});
const deny=(res,status,msg)=>res.status(status).json({ok:false,error:msg});
const auth=async(req,res,next)=>{
 const header=req.get("authorization")||"";
 if(!/^Bearer [A-Za-z0-9._~-]+$/.test(header))return deny(res,401,"Bearer session required");
 if(!pool)return deny(res,503,"Database not configured");
 const token=header.slice(7),hash=crypto.createHash("sha256").update(token).digest("hex");
 try{
  // Tokens are never logged; use only hashed lookup.
  const q=await pool.query(`select u.id,u.organization_id,u.role from sessions s
    join users u on u.id=s.user_id
    where s.token_hash=$1 and s.expires_at>now() and u.active=true limit 1`,[hash]);
  if(!q.rowCount)return deny(res,401,"Invalid or expired session");
  req.identity=q.rows[0];next();
 }catch(e){return deny(res,503,"Session verification unavailable")}
};
const owner=(req,res,next)=>["owner","admin"].includes(req.identity.role)?next():deny(res,403,"Insufficient permissions");
const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(()=>deny(res,503,"Database operation unavailable"));
app.get("/",(_req,res)=>res.json({service:"SSAG Command Center CRM",authenticated:true,persistence:!!pool}));
app.get("/api/health",async(_req,res)=>{if(!pool)return deny(res,503,"Database not configured");try{await pool.query("select 1");res.json({ok:true,database:"connected",persistence:true})}catch(e){deny(res,503,"Database unavailable")}});
app.get("/api/me",auth,(req,res)=>res.json({id:req.identity.id,role:req.identity.role}));
app.get("/api/deals",auth,wrap(async(req,res)=>{
 const r=await pool.query("select id,name,value_cents,stage,created_at from crm_deals where organization_id=$1 order by created_at desc limit 200",[req.identity.organization_id]);res.json({items:r.rows});
}));
app.post("/api/deals",auth,owner,wrap(async(req,res)=>{
 const name=String(req.body?.name||"").trim(),amount=req.body?.value_cents;
 if(!name||name.length>200||!Number.isSafeInteger(amount)||amount<0)return deny(res,400,"Valid name and nonnegative integer value_cents required");
 const client=await pool.connect();
 try{await client.query("BEGIN");const r=await client.query("insert into crm_deals(organization_id,name,value_cents,created_by) values($1,$2,$3,$4) returning id,name,value_cents,stage,created_at",[req.identity.organization_id,name,amount,req.identity.id]);
 await client.query("insert into crm_audit(organization_id,actor_id,action,entity_type,entity_id) values($1,$2,'created','deal',$3)",[req.identity.organization_id,req.identity.id,r.rows[0].id]);
 await client.query("COMMIT");res.status(201).json(r.rows[0]);}catch(e){await client.query("ROLLBACK");throw e}finally{client.release()}
}));
app.get("/api/clients",auth,wrap(async(req,res)=>{const r=await pool.query("select id,name,email,phone,created_at from crm_clients where organization_id=$1 order by created_at desc limit 200",[req.identity.organization_id]);res.json({items:r.rows})}));
app.post("/api/clients",auth,owner,wrap(async(req,res)=>{
 const name=String(req.body?.name||"").trim();if(!name||name.length>200)return deny(res,400,"Client name required");
 const c=await pool.connect();try{await c.query("BEGIN");const r=await c.query("insert into crm_clients(organization_id,name,email,phone,created_by) values($1,$2,$3,$4,$5) returning id,name,email,phone,created_at",[req.identity.organization_id,name,String(req.body.email||"").slice(0,254)||null,String(req.body.phone||"").slice(0,40)||null,req.identity.id]);await c.query("insert into crm_audit(organization_id,actor_id,action,entity_type,entity_id) values($1,$2,'created','client',$3)",[req.identity.organization_id,req.identity.id,r.rows[0].id]);await c.query("COMMIT");res.status(201).json(r.rows[0])}catch(e){await c.query("ROLLBACK");throw e}finally{c.release()}
}));
app.get("/api/invoices",auth,wrap(async(req,res)=>{const r=await pool.query("select id,client_id,amount_cents,status,created_at from crm_invoices where organization_id=$1 order by created_at desc limit 200",[req.identity.organization_id]);res.json({items:r.rows})}));
app.post("/api/invoices",auth,owner,wrap(async(req,res)=>{
 const {client_id,amount_cents}=req.body||{};
 if(!/^[0-9a-f-]{36}$/i.test(String(client_id))||!Number.isSafeInteger(amount_cents)||amount_cents<0)return deny(res,400,"Valid client_id and amount_cents required");
 const c=await pool.connect();try{await c.query("BEGIN");const r=await c.query("insert into crm_invoices(organization_id,client_id,amount_cents,created_by) select $1,id,$3,$4 from crm_clients where id=$2 and organization_id=$1 returning id,client_id,amount_cents,status",[req.identity.organization_id,client_id,amount_cents,req.identity.id]);if(!r.rowCount){await c.query("ROLLBACK");return deny(res,404,"Client not found")}await c.query("insert into crm_audit(organization_id,actor_id,action,entity_type,entity_id) values($1,$2,'created','invoice',$3)",[req.identity.organization_id,req.identity.id,r.rows[0].id]);await c.query("COMMIT");res.status(201).json(r.rows[0])}catch(e){await c.query("ROLLBACK");throw e}finally{c.release()}
}));
app.get("/api/stats",auth,wrap(async(req,res)=>{const r=await pool.query("select count(*)::int as deal_count,coalesce(sum(value_cents),0)::text as pipeline_cents from crm_deals where organization_id=$1",[req.identity.organization_id]);res.json({...r.rows[0],verified_payments:false})}));
app.get("/api/audit",auth,owner,wrap(async(req,res)=>{const r=await pool.query("select action,entity_type,entity_id,created_at from crm_audit where organization_id=$1 order by created_at desc limit 100",[req.identity.organization_id]);res.json({items:r.rows})}));
for(const p of ["/deals","/stats"]){app.all(p,(_req,res)=>deny(res,410,"Legacy unauthenticated endpoint retired; use /api with authorization"))}
app.use((_req,res)=>deny(res,404,"Not found"));
app.listen(Number(process.env.PORT||10000),"0.0.0.0");

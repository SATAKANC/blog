const express = require ('express')
const router = new express.Router()

router.get('/', (req,res)=>{
  if(!res.locals.user){
return res.redirect('/error')

  }

req.session.destroy()
return res.redirect('/index')
}
)

module.exports=router
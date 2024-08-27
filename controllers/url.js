
const { nanoid } = require('nanoid');
const URL = require('../model/url')

async function handleGenerateNewShortURL(req,res) {
    //const shortID =nanoid(8);
    const shortID = nanoid(8)
    const body = req.body;
    if(!body.url) return res.status(400).json({error: 'URL is requried'})
        console.log(body.url);
        
    await URL.create({
        shortId:shortID,
        redirectURL: body.url,
        visitHistory:[]

    });
    return res.render("home",{id: shortID})
   // return res.json({ id:shortID})
}

async function handleGetAnalystics(req,res){
   const shortId = req.params.shortId;
   const result = await URL.findOne({shortId});
   return res.json({totalClicks: result.visitHistory.length, analytics: result.visitHistory})
}

module.exports={
    handleGenerateNewShortURL,
    handleGetAnalystics,
}
const { JobModel } = require("../models/Job");
const { validateJob } = require("../validation/jobValidation")

exports.jobCtrl = {

    add: async(req,res)=>{
        let validBody=validateJob(req.body);
        if(validBody.error){
            return res.status(400).json(validBody.error.details);
        }
        try{
            let job=await new JobModel(req.body);
            job.client_id=req.tokenData.user_id;//???
            await job.save();
            res.status(200).send(job)
        }
        catch(err){
            return res.status(500).json({message:err.message});
        }
    },

    update: async(req,res)=>{
        let validBody=validateJob(req.body);
        if(validBody.error){
            return res.status(400).json(validBody.error.details);
        }
        let jobId = req.params.job_id;
        try{
            let job=await JobModel.updateOne({_id:jobId,client_id:req.tokenData.user_id},req.body);
            res.status(200).send(job)
        }
        catch(err){
            return res.status(500).json({message:err.message});
        }
    },

    delete:async(req,res)=>{
        let jobId=req.params.job_id;
        try{
            let job=await JobModel.deleteOne({_id:jobId,client_id:req.tokenData.user_id});
            res.status(200).send(job)
        }
        catch(err){
            return res.status(500).json({message:err.message});
        }
    }
    
}
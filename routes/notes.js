const exp = require("express");
const Note = require("../models/Note");
const fetchUser  = require("../middleware/fetchUser");
const router = exp.Router();

router.get("/fetchAllNotes", fetchUser ,async (req,res)=>{
    try
    {
        const userId = req.user.id;
        const notes = await Note.find({user:userId});
        res.status(200).send(notes);
    }
    catch (error){
        console.error(error);
        res.status(500).json({error:error.message});
    }
});

router.post("/addNote", fetchUser ,async (req,res)=>{
    try
    {
        const userId = req.user.id;
        const note  = await new Note({
            title:req.body.title,
            description:req.body.description,
            priorityLevel:req.body.priorityLevel,
            expectedDate:req.body.expectedDate,
            user:userId
        });
        
        note.save()
        .then(() => {
            res.status(200).json({ note });
            console.log(req.body.title + " saved");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
    }
    catch (error){
        console.error(error);
        res.status(500).json({error:error.message});
    }
});

router.put("/updateNote/:id", fetchUser ,async (req,res)=>{
    try
    {
        const note = await Note.findById(req.params.id);

        if(!note)
        {
            return res.status(401).send("Note not found");
        }

        if(note.user.toString()!==req.user.id)
        {
            return res.status(401).send("Come on bro, your pronouns are just He/ 'cause you will never be Him");
        }

        if (req.body.title) {
          note.title = req.body.title;
        }

        if (req.body.description) {
          note.description = req.body.description;
        }

        if (req.body.priorityLevel) {
          note.priorityLevel = req.body.priorityLevel;
        }

        if (req.body.expectedDate) {
          note.expectedDate = req.body.expectedDate;
        }

        note.save()
        .then(() => {
            res.status(200).json({ note });
            console.log(note.title + " updated");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
    }
    catch (error){
        console.error(error);
        res.status(500).json({error:error.message});
    }
});

router.delete("/deleteNote/:id", fetchUser ,async (req,res)=>{
    try
    {
        const note = await Note.findById(req.params.id);

        if(!note)
        {
            return res.status(401).send("Note not found");
        }

        if(note.user.toString()!==req.user.id)
        {
            return res.status(401).send("Come on bro, your pronouns are just He/ 'cause you will never be Him");
        }

        note.deleteOne()
        .then(() => {
            res.status(200).json({message:`${note.title} + Deleted`});
            console.log(note.title + " deleted");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
    }
    catch (error){
        console.error(error);
        res.status(500).json({error:error.message});
    }
});

module.exports = router;
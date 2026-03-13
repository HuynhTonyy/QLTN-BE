const router = require("express").Router()
const Personnel = require("../models/Personnel")
const { protect } = require("../middleware/authMiddleWare")

router.get("/", protect, async (req, res) => {
  const list = await Personnel.find()
  res.json(list)
})

router.post("/", protect, async (req, res) => {
  const p = new Personnel(req.body)
  await p.save()
  res.json(p)
})

router.put("/:id", protect, async (req, res) => {
  const updated = await Personnel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(updated)
})

module.exports = router
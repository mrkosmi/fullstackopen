const express = require('express')
const mongoose = require('mongoose')
const app = require('./app')

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
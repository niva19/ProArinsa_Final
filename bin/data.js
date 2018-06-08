const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10


module.exports.comparePassword = function (candidatePassword, hash) {
  return new Promise((t, c) => {
    bcrypt.compare(candidatePassword, hash)
      .then((res) => {
        if (res)
          t()
        else
          c('Something is wrong')
      })
      .catch(c)
  })
}
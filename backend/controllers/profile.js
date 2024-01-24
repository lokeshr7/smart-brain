const handleProfileGet = (req,res,db) => {
  const {id} = req.params
	/*const index = database.users.findIndex(user => user.id === id)
	console.log(index)*/
  db.select('*').from('users').where('id',id)
	.then(user => {
		if(user.length)
			res.json(user[0])
		else
		  res.status(404).json('user ID does not exist')
	})
	.catch(err => res.status(400).json('unable to fetch profile'))
}

module.exports = {
	handleProfileGet
}
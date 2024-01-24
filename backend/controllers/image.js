const detectFace = (IMAGE_URL, res) => {

  const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
  const MODEL_ID = 'face-detection';
  const stub = ClarifaiStub.grpc();
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key " + process.env.PAT);

  stub.PostModelOutputs({
    user_app_id: {
      "user_id": process.env.USER_ID,
      "app_id": process.env.APP_ID
    },
    model_id: MODEL_ID,
    inputs: [{ data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }]
  },
    metadata, (err, response) => {
      if (err) {
        throw new Error(err);
      }
      if (response.status.code !== 10000) {
        throw new Error("Post model outputs failed, status: " + response.status.description);
      }
      res.json(response.outputs[0].data.regions[0].region_info.bounding_box);
    }
  );

}

const handleApiCall = (req, res) => {
  try {
    detectFace(req.body.input, res)
  }
  catch (err) {
    res.status(400).json('Clarifai API error: ', err)
  }
}

const handleImage = (req, res, db) => {
  const { id } = req.body
  db('users').where('id', '=', id).increment('entries', 1).returning('entries')
    .then(entries => {
      res.json(entries[0])})
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}


module.exports = {
  luisApi: {
    urlBase: 'https://brazilsouth.api.cognitive.microsoft.com/luis/v2.0',
    path: '/apps',
    appId: '/7f3ff43d-341d-4864-ba9f-3d9c2e588df2',
    subscriptionKey: 'bb3bb7b0dea143d493d00798a06a746a'
  },
  customVisionModelOne: {
    urlBase: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0',
    prediction: {
      predictionKey: '4ca9ba0bb8884dc18152c1b47e131e7d',
      projectId: 'c1845148-5f27-4526-928f-2394cc2900c6',
      path: '/Prediction/',
      postPath: '/image'
    }
  },
  customVisionNewModel: {
    urlBase: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0',
    prediction: {
      predictionKey: 'd62f358e4d46421d9e53fcfcf1283cb6',
      projectId: '375d84d4-e685-4793-bde1-18d037a5055b',
      path: '/Prediction/',
      postPath: '/image'
    }
  },
  computerVisionApi: {
    urlBase: 'https://eastus.api.cognitive.microsoft.com/vision/v1.0',
    subscriptionKey: 'd97f11db748e4f8689b36d10bb63a3bd',//'da619ef04b8143bb8669f6dcdd5dd02e',
    ocr: {
      urlBase: 'https://eastus.api.cognitive.microsoft.com/vision/v1.0',
      path: '/ocr?detectOrientation=true',
      subscriptionKey: 'd97f11db748e4f8689b36d10bb63a3bd',//'4557d577dd6f4929b7fd6d5ca5c8bd61'
    },
    visionAnalize: {
      path: '/analyze',
      params: {
        'visualFeatures': 'Categories,Tags,Description,Faces,ImageType,Color,Adult',
        'details': 'Celebrities,Landmarks',
        'language': 'en',
      }
    }
  },
  faceApi: {
    urlBase: 'https://eastus2.api.cognitive.microsoft.com/face/v1.0',
    subscriptionKey: 'b255f5f7ad2648279632be30a2119c08',//11df0855c3f6403c8fbfcf819e0a52a0',
    detect: {
      path: '/detect',
      params: {
        'returnFaceId': true,
        'returnFaceLandmarks': true,
        'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
      }
    },
    verify: {
      path: '/verify'
    }
  }
}

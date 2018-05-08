export class FaceDetectionModel {

  public customerId: string;

  public recommendation: {
    status: boolean,
    reasons: string[]
  }
  
  public properties: {
    explicitContent: {
      adultScore: number,
      racyScore: number
    },
    faceDetection: {
      faceId: string,
      faceLength: number
    },
    glasses: {
      glassesType: string,
      value: number
    },
    faceQuality: {
      blur: string,
      blurValue: number,
      exposure: string,
      exposureValue: number,
      noise: string,
      noiseValue: number
    }

  }
  constructor() {
    this.customerId = '';
    this.recommendation = {
      status: true,
      reasons: []
    };
    this.properties = {
      explicitContent: {
        adultScore: -1,
        racyScore: -1
      },
      faceDetection: {
        faceId: '',
        faceLength: -1
      },
      glasses: {
        glassesType: '',
        value: -1
      },
      faceQuality: {
        blur: '',
        blurValue: -1,
        exposure: '',
        exposureValue: -1,
        noise: '',
        noiseValue: -1
      }
    }
  }


}

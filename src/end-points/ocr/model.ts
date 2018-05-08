export class OcrModel {

  public customerId: string;

  public recommendation: {
    status: boolean,
    reasons: string[]
  };

  public properties: {
    classification: {
      documentType: string,
      documentTypeValue: number
    },
    content: {
      length: number,
      score: number
    },
    entities: {
      name: string[],
      date: string[],
      document: {},
      RGCNH:{}
    }
  }

  constructor() {
    this.customerId = '';
    this.recommendation = {
      status: true,
      reasons: []
    };
    this.properties = {
      classification: {
        documentType: '',
        documentTypeValue: -1
      },
      content: {
        length: -1,
        score: -1
      },
      entities: {
        name: [],
        date: [],
        document: {},
        RGCNH:{}
      }
    }
  }
}



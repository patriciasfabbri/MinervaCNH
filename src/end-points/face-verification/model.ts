

export class FaceVerificationModel {
	public customerId: string;
	public recommendation: { status: boolean };
	public properties: {
		confidence: number;
		isIdentical: boolean;
	}

	constructor() {
		this.customerId = '';
		this.recommendation = { status: false };
		this.properties = { confidence: -1, isIdentical: false };
	}
}

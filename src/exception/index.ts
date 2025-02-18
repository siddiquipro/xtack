export class Exception extends Error {
	status: number;
	constructor(message: string, status: number = 500) {
		super(message);
		this.status = status;
	}
}

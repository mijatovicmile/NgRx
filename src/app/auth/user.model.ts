export class User {
    constructor(
        public email: string, 
        public id: string, 
        private _token: string, 
        private _tokenExpirationDate: Date
    ) {}

    /**
     * Getter is a special type of property where we can write code that runs when we try 
     * to access this property. A getter also means that the user can't overwrite this token, 
     * because it's only a getter and not a setter. 
     */
    get token() {
        /**
         * If token expiration date is not exist, 
         * or the token is expired (the token expiration date is smaller that the current date)
         */
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}
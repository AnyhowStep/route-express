(BigInt.prototype as any).toJSON = function (this : bigint) {
    if (BigInt(Number(this)) === this) {
        return Number(this);
    } else {
        return this.toString();
    }
};
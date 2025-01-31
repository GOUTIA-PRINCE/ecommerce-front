export class Product {

    constructor(public id:number,
        public sku: String,
        public name: String,
        public description: String,
        public unit_price: number,
        public image_url: String,
        public active: Boolean,
        public units_in_stock: number,
        public date_created: Date,
        public date_update: Date
) {
}
}

namespace control {
    let nextComponentId: number;

    export class Component {
        protected _id: number;
        constructor(id = 0) {
            if (!nextComponentId)
                nextComponentId = 20000
            if (!id) id = ++nextComponentId
            this._id = id
        }

        getId() {
            return this._id;
        }
    }
}


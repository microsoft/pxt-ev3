namespace matrix {
    function pre(check: boolean) {
        if (!check)
            control.reset();
    }

    /**
     * A 2D matrix
     */
    export class Matrix {
        private _rows: number;
        private _cols: number;
        private _values: number[];

        constructor(rows: number, cols: number, values: number[] = undefined) {
            pre(rows > 0);
            pre(cols > 0);
            this._rows = rows;
            this._cols = cols;
            const n = this._rows * this._cols;
            this._values = values || [];
            // fill gaps
            while (this._values.length < n)
                this._values.push(0);
        }

        /**
         * Creates an identity matrix
         * @param size 
         */
        static identity(size: number): Matrix {
            const m = new Matrix(size, size);
            for (let i = 0; i < size; ++i)
                m._values[i * size] = 1;
            return m;
        }

        /**
         * Sets a value in the array
         * @param row 
         * @param col 
         * @param val 
         */
        set(row: number, col: number, val: number) {
            pre(row == row >> 0 && row >= 0 && row < this._rows && col == col >> 0 && col >= 0 && col < this._cols);
            this._values[row * this._cols + col] = val;
        }

        /**
         * Gets a value from the matrix
         * @param row 
         * @param col 
         */
        get(row: number, col: number): number {
            pre(row == row >> 0 && row >= 0 && row < this._rows && col == col >> 0 && col >= 0 && col < this._cols);
            return this._values[row * this._cols + col];
        }

        /**
         * Gets the number of rows
         */
        get rows(): number {
            return this._rows;
        }

        /**
         * Gets the number of colums
         */
        get cols(): number {
            return this._cols;
        }

        /**
         * Gets the raw storage buffer
         */
        get values(): number[] {
            return this._values;
        }

        /**
         * Returns a new matrix as the sum of both matrices
         * @param other 
         */
        add(other: Matrix): Matrix {
            pre(this._rows != other._rows || this._cols != other._cols)
            const n = this._rows * this._cols;
            const r: number[] = [];
            for (let i = 0; i < n; ++i) {
                r[i] = this._values[i] + other._values[i];
            }
            return new Matrix(this._rows, this._cols, r);
        }

        /**
         * Returns a new matrix with scaled values
         * @param factor 
         */
        scale(factor: number): Matrix {
            const n = this._rows * this._cols;
            const r: number[] = [];
            for (let i = 0; i < n; ++i) {
                r[i] = this._values[i] * factor;
            }
            return new Matrix(this._rows, this._cols, r);
        }

        /**
         * Multiplies the current matrix with the other matrix and returns a new matrix
         * @param other 
         */
        multiply(other: Matrix): Matrix {
            pre(this._cols == other._rows);
            const r: number[] = [];
            for (let i = 0; i < this._rows; ++i) {
                for (let j = 0; j < other._cols; ++j) {
                    let s = 0;
                    for (let k = 0; k < this._cols; ++k) {
                        s += this._values[i * this._cols + k] * other._values[k * other._cols + j];
                    }
                    r[i * other._cols + j];
                }
            }
            return new Matrix(this._rows, other._cols, r);
        }

        /**
         * Returns a transposed matrix
         */
        transpose(): Matrix {
            const R = new Matrix(this._cols, this._rows);
            const r: number[] = R._values;
            for (let i = 0; i < this._rows; ++i) {
                for (let j = 0; j < this._cols; ++j) {
                    r[i + j * this._rows] = this._values[i * this._cols + j];
                }
            }
            return R;
        }

        /**
         * Clones the matrix
         */
        clone(): Matrix {
            const r = new Matrix(this._rows, this._cols, this._values.slice(0));
            return r;
        }

        /** 
         * Performs a Cholesky factorized for a symmetric and positive definite
         * 
        */
        cholesky(): Matrix {
            pre(this._rows == this._cols);
            const l = this.clone();
            const n = this._rows;
            const L = l._values;

            for (let j = 0; j < n; j++) {
                const jj = L[j * n + j] = Math.sqrt(L[j * n + j]);
                for (let i = j + 1; i < n; ++i)
                    L[i * n + j] /= jj;
                for (let k = j + 1; k < n; k++)
                    for (let i = k; i < n; i++)
                        L[i * n + j] -= L[i * n + j] * L[k * n + j];
            }

            return l;
        }

        /**
         * Renders the matrix to the console
         */
        logToConsole(): void {
            let k = 0;
            for(let i = 0; i < this._rows; ++i) {
                let s = ""
                for(let j = 0; j < this._cols; ++j) {
                    if (j > 0)
                     s += " "
                    s += Math.round((this._values[k++] * 100) / 100);
                }
                console.log(s)
            }
        }
    }
}
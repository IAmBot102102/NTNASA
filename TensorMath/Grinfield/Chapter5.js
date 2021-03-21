// Basically the identity matrix
const kronecker_delta = [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1]
];
const KD = kronecker_delta;

// Summation and Product Functions
const summation = (sum_function, start, stop) => {
    var total_sum = 0;
    for(var i = Math.min(start, stop); i < Math.max(start,stop); i++){
        total_sum += sum_function(i);
    }
    return total_sum;
};
const product = (prod_function, start, stop) => {
    var total_prod = 0;
    for(var i = Math.min(start, stop); i < Math.max(start,stop); i++){
        total_prod *= prod_function(i);
    }
    return total_prod;
};

const i_hat = [1, 0, 0];
const j_hat = [0, 1, 0];
const k_hat = [0, 0, 1];

const mag = (vec, metric) => {
    return Math.sqrt(summation((i)=>{return summation((j)=>{return metric[i][j]*vec[i]*vec[j];}, 0, vec.length)}, 0, vec.length));
}

const dot_product = (vec_1, vec_2, angle = null) => {
    if(angle == null){
        return summation(
            (index)=>{return vec_1[index]*vec_2[index]},
            0, Math.min(vec_1.length, vec_2.length)
        );
    }
    else {
        mag(vec_1) * mag(vec_2) * Math.cos(angle);
    }
};

const scalar_multiply = (scalar, vec)=>{
    for(var i = 0; i < vec.length; i++){vec[i]*=scalar;}
};
const scale = scalar_multiply;

const create_matrix = (dim_1, dim_2, fill=0, fill_func=null) => {
    var n_matrix = new Array();
    for(var i = 0; i < dim_1; i++){
        n_matrix.push(new Array());
        for(var j = 0; j < dim_2; j++){
            if(fill_func == null) {n_matrix[i][j] = fill}
            else {n_matrix[i][j] = fill_func(i,j);}
        }
    }
    return n_matrix;
}


const matrix_add = (mat_1, mat_2) => {
    var resultant = create_matrix(Math.min(mat_1.length, mat_2.length), Math.min(mat_1[0].length, mat_2[0].length));
    for(var i = 0; i < Math.min(mat_1.length, mat_2.length); i++){
        for(var j = 0; j < Math.min(mat_1[i].length, mat_2[i].length); j++){
            resultant[i][j] = mat_1[i][j] + mat_2[i][j];
        }
    }
}
const matrix_mult = (mat_1, mat_2, round = false, debug=false) => {
    var resultant = create_matrix(mat_1.length, mat_2[0].length);
    if(mat_1[0].length != mat_2.length){return resultant;}
    var invariant = mat_1[0].length;
    for(var i = 0; i < mat_1.length; i++){
        for(var j = 0; j < mat_2[0].length; j++){

            if(debug){console.log('-------------------');}
            resultant[i][j] = summation(
                (index) => { if(debug){console.log("Performed " + mat_1[i][index] + " * " + mat_2[index][j]);} return mat_1[i][index] * mat_2[index][j]; },
                0, invariant
            )
            if(debug){
                console.log('SUM = ' + resultant[i][j]);
                if(round){
                    
                    console.log('Rounded SUM = ' + resultant[i][j]);
                }
            }
            if(round){resultant[i][j] = Math.round(resultant[i][j]);}
        }
    }
    return resultant;
};
const string_repeat = (string, number) => {var total_string = ""; for(var i = 0; i < number; i++){total_string+=string;} return total_string;}
const print_matrix = (mat_1) => {
    var max_length = 0;
    for(var i = 0; i < mat_1.length; i++){
        var current_max=0;
        for(var j = 0; j < mat_1[i].length; j++){
            current_max += mat_1[i][j].toString().length + 2;
        }
        if(current_max > max_length){max_length = current_max;}
    }
    console.log("[");
    for(var i = 0; i < mat_1.length; i++){
        var string = "\t[ \x1b[36m ";
        current_length=0;
        for(var j = 0; j < mat_1[i].length; j++){
            string += mat_1[i][j];
            if(j != mat_1[i].length-1){string+= "\x1b[0m , \x1b[36m"}
            current_length += mat_1[i][j].toString().length + 2;
        }
        console.log(string + string_repeat(" ", max_length-current_length) + "\x1b[0m ]");
    }
    console.log("]");
}
const print_vec = (vec) => {
    var max_length = 0;
    for(var i = 0; i < vec.length; i++){
        var current_max=0;
        current_max += vec[i].toString().length + 3;
        if(current_max > max_length){max_length = current_max;}
    }
    console.log("[");
    for(var i = 0; i < vec.length; i++){
        var string = "\t[ \x1b[36m ";
        current_length=0;
        string += vec[i];
        current_length += vec[i].toString().length + 2;
        console.log(string + string_repeat(" ", max_length-current_length) + "\x1b[0m ]");
    }
    console.log("]");
}
function det(mat){
    if(mat.length == 2){return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];}
    var determinate = 0;
    for(var i = 0; i < mat.length; i++){
        determinate += Math.pow(-1, i) * mat[0][i] * det(create_matrix(mat.length - 2, mat.length - 2, 0, (j,k) => {
            return mat[j + 1][k + 1];
        }));
    }
    return determinate;
    
}
const matrix_scale = (scalar, mat) => {
    return create_matrix(mat.length, mat[0].length, 0, (i, j) => {return mat[i][j] * scalar;});
}
const form_vec = (string) => { return "\x1b[31m" + string + "\x1b[0m"}
const adjoint_matrix = create_matrix(2, 2, 0, (i,j) => {return Math.pow(-1, i+j);});
const Inv = (mat) => { print_matrix(adjoint_matrix); return matrix_scale((1/det(mat)), matrix_mult(mat, adjoint_matrix));}
/// -----------------------------------------------------------------------------
const Z_bC = kronecker_delta;
const Z_mC = create_matrix(3, 3, 0, (i, j) => {return kronecker_delta[i][j];});
const V_C = [4, 3];
console.log(form_vec("V") + " in Cartesian coordinates is");
print_vec(V_C);
console.log("With magnitude using the Cartesian Metric.");
console.log(mag(V_C, Z_mC));

console.log("Just as an example, in affine coordinates. We can take a vector " + form_vec("Z_1") + 
    " = " + form_vec("i") + " and " + form_vec("Z_2") + " = " + form_vec("j") + 
    " which have an angle of \x1b[34m pi \x1b[0m / \x1b[36m 3 \x1b[0m radians between eachother.");

console.log("We can compute the metric with the dot product, like this...");
console.log("We can create a basis for affine.");
const Z_bA = [[2,0], [0, 1]];
print_matrix(Z_bA);
console.log("So Z_mA is ");
const Z_mA = create_matrix(2, 2, 0, (i, j) => {return dot_product(Z_bA[i], Z_bA[j])});
print_matrix(Z_mA);
console.log("So the contravariant Z_mA is");
print_matrix(Inv(Z_mA));
print_matrix(matrix_mult(Z_mA, Inv(Z_mA)))
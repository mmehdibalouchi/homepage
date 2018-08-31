/**
 * Created by mehdi on 1/15/2017 AD.
 */

var I = function(n) {
    var A = new Array(n);
    for(var i = 0; i<n; i++)
    {
        A[i] = new Array(n);
        for(var j = 0; j<n ;j++) {
            if(i == j)
                A[i][j] = 1;
            else
                A[i][j] = 0;
        }
    }
    return A;
}

function generateTable()
{
    document.getElementById("matrix").innerHTML = "";
    document.getElementById("matrix").innerHTML+= '<div class="label">Fill the matrix';
    document.getElementById("matrix").innerHTML+= '<div id="matrixtable">';
    document.getElementById("matrixtable").innerHTML+= '<table  id="matrix-table">';
    var n = parseInt(document.getElementById("dimention").value);
     document.getElementById("matrix-table").innerHTML+= "<tbody id='tablebody'>";
    for(var i = 0; i< n; i++)
    {
        document.getElementById("tablebody").innerHTML+= "<tr  id='tabler"+i+"' >";
        for (var j = 0; j < n; j++)
        {
            document.getElementById("tabler"+i).innerHTML+= "<td   id='tabled"+i*n+j+ "' >";
            var idS = (i*n)+j;
            idS.toString();
            document.getElementById("tabled"+i*n+j).innerHTML+= '<input type="text" id="'+idS+'" >';
            //document.getElementById("tablebody").innerHTML+= "</td>"

        }
        //document.getElementById("matrix-table").innerHTML+= "</tr>"
    }
    document.getElementById("matrix").innerHTML += "<button onclick='buildLU()' style='margin: 10px'>LU Decomposition</button>"
}

function buildLU(dim)
{
    var n = parseInt(document.getElementById("dimention").value);
    var A = new Array(n);
    for(var i=0; i<n; i++)
    {
        A[i] = new Array(n);
        for(var j = 0; j < n; j++)
        {
            var number = i * n + j;
            A[i][j] = parseFloat(document.getElementById(number.toString()).value);
        }
    }
    showMatrix(LUFactorization(A));
    //showMatrix(A)

}

function buildL(L)
{
    document.getElementById("Lmatrix").innerHTML = "";
    document.getElementById("Lmatrix").innerHTML+= '<div class="label">L Matrix';
    document.getElementById("Lmatrix").innerHTML+= '<table style="background-color:lightgreen"  id="Lmatrix-table">';
    var n = L.length;
    document.getElementById("Lmatrix-table").innerHTML+= "<tbody id='Ltablebody'>";
    for(var i = 0; i< n; i++)
    {
        document.getElementById("Ltablebody").innerHTML+= "<tr id='Ltabler"+i+"' >";
        for (var j = 0; j < n; j++)
        {
            document.getElementById("Ltabler"+i).innerHTML+= "<td  id='Ltabled"+i*n+j+ "' >";
            var idS = L[i][j];
            idS.toString();
            document.getElementById("Ltabled"+i*n+j).innerHTML+= idS;
        }
    }

}

function buildU(U)
{
    document.getElementById("Umatrix").innerHTML = "";
    document.getElementById("Umatrix").innerHTML+= '<div class="label">U Matrix';
    document.getElementById("Umatrix").innerHTML+= '<table style="background-color:palevioletred" id="Umatrix-table">';
    var n = U.length;
    document.getElementById("Umatrix-table").innerHTML+= "<tbody id='Utablebody'>";
    for(var i = 0; i< n; i++)
    {
        document.getElementById("Utablebody").innerHTML+= "<tr id='Utabler"+i+"' >";
        for (var j = 0; j < n; j++)
        {
            document.getElementById("Utabler"+i).innerHTML+= "<td  id='Utabled"+i*n+j+ "' >";
            var idS = U[i][j];
            idS.toString();
            document.getElementById("Utabled"+i*n+j).innerHTML+= idS;
        }
    }
}

function LUFactorization(A)
{
    var pc = 0;
    var ec = 0;
    var Parray = [];
    var Marray = [];
    //copy A
    var U = A;
    showMatrix(A);
    for(var i = 0; i< A.length; i++)
    {
        Parray[i] = createP(U, i);
        U = innertMatrixProduct(Parray[i], U);
        Marray[i] = createM(U, i);
        U = innertMatrixProduct(Marray[i], U);
    }
    buildU(U);
    showMatrix(U);
    var Lp = I(A.length);
    for(var i = 0; i< A.length; i++)
    {
        Lp = innertMatrixProduct(Lp, inverse(Parray[i]));
        Lp = innertMatrixProduct(Lp, inverse(Marray[i]));
    }
    var p = Parray[A.length - 1];
    for(var i = A.length - 2; i>=0; i--)
    {
        p = innertMatrixProduct(p, Parray[i]);
    }
    var L = innertMatrixProduct(p, Lp);
    buildL(L)
    showMatrix(L)
    //showMatrix(innertMatrixProduct(L, U));
    return [[1]];
}

function createM(A, i)
{
    var pivot = -1 * A[i][i];
    var res = I(A.length);
    for(var k = i+1; k< A.length; k++)
        res[k][i] = A[k][i]/ pivot;
    return res;
}

function createP(A, i)
{
    var p = i;
    var max = Math.abs(A[i][i]);
    for(var j = i+1; j < A.length; j++)
    {
        if(Math.abs(A[j][i]) > max)
        {
            max = Math.abs(A[j][i]);
            p = j;
        }
    }

    var res = I(A.length);
    var swap = res[i];
    res[i] = res[p];
    res[p] = swap;
    return res;

}

function innertMatrixProduct(A, B)
{
    var resArray = new Array(A.length);
    for(var i = 0; i<resArray.length; i++)
        resArray[i] = new Array(A[0].length);

    for(var m = 0; m < resArray.length; m++)
        for(var n = 0; n < resArray[0].length; n++) {
            resArray[m][n] = 0.00;
            for (var j = 0; j < A[m].length; j++) {
                var num = A[m][j] * B[j][n];
                var fixed = parseFloat(num);
                resArray[m][n] += fixed;
            }
        }
    return resArray;
}

function inverse(M){
    if(M.length !== M[0].length){return;}
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
        I[I.length]=[];
        C[C.length]=[];
        for(j=0; j<dim; j+=1){
            if(i==j){ I[i][j] = 1; }
            else{ I[i][j] = 0; }
            C[i][j] = M[i][j];
        }
    }
    for(i=0; i<dim; i+=1){
        e = C[i][i];
        if(e==0){
            for(ii=i+1; ii<dim; ii+=1){
                if(C[ii][i] != 0){
                    for(j=0; j<dim; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    break;
                }
            }
            e = C[i][i];
            if(e==0){return}
        }

        for(j=0; j<dim; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        for(ii=0; ii<dim; ii++){
            if(ii==i){continue;}
            e = C[ii][i];
            for(j=0; j<dim; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    return I;
}

function showMatrix(matrix)
{
    var res = "";
    for(var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            res = res + matrix[i][j].toString() + "\t";
        }
        res+="\n";
    }
    console.log(res)
}

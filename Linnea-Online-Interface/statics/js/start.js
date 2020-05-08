
var observe;
if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
    };
}
else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}
function inittxtExpr () {
    var text = document.getElementById('txtExpr');
    function resize () {
        text.style.height = 'auto';
        text.style.height = text.scrollHeight+'px';
    }
    /* 0-timeout to get the already changed text */
    function delayedResize () {
        window.setTimeout(resize, 0);
    }
    observe(text, 'change',  resize);
    observe(text, 'cut',     delayedResize);
    observe(text, 'paste',   delayedResize);
    observe(text, 'drop',    delayedResize);
    observe(text, 'keydown', delayedResize);

    text.focus();
    text.select();
    resize();
}


var examples = {

  input1: {
    name: "Least Squares",
    expr: "\\(b = (X^TX)^{-1}X^Ty\\)",
    code: "b=inv(trans(X)*X)*trans(X)*y",
  },
  input2:{
    name: "Generalized Least Squares",
    expr: "\\(z = (X^TS^{-1}X)^{-1}X^TS^{-1}y\\)",
    code: "z=inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y",
  },
  input3:{
    name: "Triangular Matrix Inversion",
    expr: ["\\(X_{10} = L_{10} L_{00}^{-1}\\)" , "\\(X_{20} = L_{20}+L_{22}^{-1}L_{21}L_{11}^{-1}L_{10}\\)","\\(X_{11} = L_{11}^{-1}\\)", "\\(X_{21} = -L_{22}^{-1}L_{21}\\)"],
    code: "X10=L10*inv(L00)\nX20=L20+(inv(L22)*L21*inv(L11)*L10)\nX11=inv(L11)\nX21=inv(L22)*L21*-1",
  },
  input4:{
    name: "Image Restoration",
    expr: ["\\(H^{\\dagger} = -H^{T}(HH^{T})\\) ", "\\(y_k=H^{\\dagger}y+x(I-HH^{\\dagger})\\)"],
    code: "H_dag=trans(H)*inv(H*trans(H))\ny_k=H_dag*y+(I+(-1*H_dag*H))*x",
  },
  input5:{
    name: "Stochastic Newton",
    expr: ["\\(A = (k/k-1)*B_{in}\\)", "\\(B = I_{n}\\)", "\\(C = -A^{T}*W_{k}*W_{k}^{T}*A*B_{in}\\)", "\\(D=(k-1)*I_{1}\\)", "\\(E=W_{k}^{T}*A*B_{in}*A^{T}*B_{in}\\)","\\(B_{out}=A*(B+(C*(D+E)))\\)"],
    //expr: "\\(B_{out}=((k/k-1)*B_{in}*(I_{n}+(-A^{T}*W_{k}*A*((k-1)*I_{1}+(W_{k})^{T}*A*B_{in}*A^{T}*W_{k})^{-1}*B_{in}*A^{T}*W_{k}))\\)",
    code: "Bout=(k*inv(k-1))*Bin*(In+(-1*trans(A)*Wk*inv((k-1)*I1+trans(Wk)*A*Bin*trans(A)*Wk)*trans(Wk)*A*Bin))",
 },

};

var listExamplesBody = "";
for (var e in examples) {

  //:&nbsp;
  if(examples[e].name == "Triangular Matrix Inversion" ){
    listExamplesBody += "<li id=\"example_";
    listExamplesBody += e;
    listExamplesBody += "\" class=\"mdl-menu__item\" style=\"height: 100px;\" >";
    listExamplesBody += "<ul style=\"list-style: none; padding-left: 0;font-size: 11px;\"><li class=\"\">";
    listExamplesBody += examples[e].name;
    listExamplesBody += ":&nbsp ";
    listExamplesBody += examples[e].expr[0];
    listExamplesBody += "</li><li class=\"\" style=\"padding-left: 163px;\">";
    listExamplesBody += examples[e].expr[1];
    listExamplesBody += "</li><li class=\"\" style=\"padding-left: 163px;\">";
    listExamplesBody += examples[e].expr[2];
    listExamplesBody += "</li><li  class=\"\" style=\"padding-left: 163px;\">";
    listExamplesBody += examples[e].expr[3];
    listExamplesBody += "</li></ul></li>";

  }else if(examples[e].name == "Image Restoration"){
    listExamplesBody += "<li id=\"example_";
    listExamplesBody += e;
    listExamplesBody += "\" class=\"mdl-menu__item\" style=\"height: 50px; \" >";
    listExamplesBody += "<ul style=\"list-style: none; padding-left: 0;font-size: 11px;\"><li class=\"\">";
    listExamplesBody += examples[e].name;
    listExamplesBody += ":&nbsp ";
    listExamplesBody += examples[e].expr[0];
    listExamplesBody += "</li><li class=\"\" style=\"padding-left: 116px;\">";
    listExamplesBody += examples[e].expr[1];
    listExamplesBody += "</li></ul></li>";

  }else if(examples[e].name == "Stochastic Newton"){
    listExamplesBody += "<li id=\"example_";
    listExamplesBody += e;
    listExamplesBody += "\" class=\"mdl-menu__item\" style=\"height: 150px;\" >";
    listExamplesBody += "<ul style=\"list-style: none; padding-left: 0;font-size: 11px;\"><li class=\"\">";
    listExamplesBody += examples[e].name;
    listExamplesBody += ":&nbsp ";
    listExamplesBody += examples[e].expr[0];
    listExamplesBody += "</li><li class=\"\" style=\"padding-left: 115px;\">";
    listExamplesBody += examples[e].expr[1];
    listExamplesBody += "</li><li  class=\"\" style=\"padding-left: 115px;\">";
    listExamplesBody += examples[e].expr[2];
    listExamplesBody += "</li><li  class=\"\" style=\"padding-left: 115px;\">";
    listExamplesBody += examples[e].expr[3];
    listExamplesBody += "</li><li  class=\"\" style=\"padding-left: 115px;\">";
    listExamplesBody += examples[e].expr[4];
    listExamplesBody += "</li><li  class=\"\" style=\"padding-left: 115px;\">";
    listExamplesBody += examples[e].expr[5];
    listExamplesBody += "</li></ul></li>";

  }else{
    listExamplesBody += "<li id=\"example_";
    listExamplesBody += e;
    listExamplesBody += "\" class=\"mdl-menu__item\" style=\"font-size: 11px;\">";

    listExamplesBody += examples[e].name;
    listExamplesBody += ":&nbsp ";
    listExamplesBody += examples[e].expr;
    listExamplesBody += "</li>";

  }

}
$("#listExamples").html(listExamplesBody);

for (var e in examples) {

  (function(code, formats) {
    var setExample5 = function() {
      out("4");
      $("#txtExpr").css('height','64px');
      $("#txtExpr").val(code);
      $("#txtExpr").html(code);
      $("#lblError").css('visibility', 'hidden');
      model.setInput(code);
    };
    var setExample4 = function() {
      out("4");
      $("#txtExpr").css('height','64px');
      $("#txtExpr").val(code);
      $("#txtExpr").html(code);
      $("#lblError").css('visibility', 'hidden');
      model.setInput(code);
    };
    var setExample3 = function() {
      out("3");
      $("#txtExpr").css('height','128px');
      $("#txtExpr").val(code);
      $("#txtExpr").html(code);
      $("#lblError").css('visibility', 'hidden');
      model.setInput(code);
    };
    var setExample = function() {
      out("else");
      $("#txtExpr").css('height','32px');
      $("#txtExpr").val(code);
      $("#txtExpr").html(code);
      $("#lblError").css('visibility', 'hidden');
      model.setInput(code);
    };
    if(examples[e].name == "Image Restoration"){
      $("#example_" + e).click(setExample4);
    }else if(examples[e].name == "Triangular Matrix Inversion"){
      $("#example_" + e).click(setExample3);
    }else if(examples[e].name == "Stochastic Newton"){
      $("#example_" + e).click(setExample5);
    }else{
      $("#example_" + e).click(setExample);
    }
    $("#lblError").css('visibility', 'hidden');

  })(examples[e].code, examples[e].formats);
}



  function out(blah){
    console.log(blah);
  } ;


  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  $("#txtExpr").keyup(function() {

    var inputString = $("#txtExpr").val();
    if(inputString == ""){
      $("#tblFormats").hide();
    }else{
      model.setInput(inputString.trim());
      $("#lblError").css('visibility', 'hidden');
    }
  });


  //select2js


  function getVarNamesFromString(StrObj) {
    var separateNamesBy = ", ";
    var name = "<none>"; // if no match, use this
    var namesArray = StrObj.match(/[a-zA-Z_][a-zA-Z0-9_]*/gi);
    var scannedarray = [];
    var ban_inv = "inv";
    var ban_trans = "trans";
    if (namesArray) {
        name = "";
        for (var i = 0; i < namesArray.length; i++) {
            //out(ifVarExists(StrObj,namesArray[i]));
            if (i != 0) name += separateNamesBy;
            if(((namesArray[i] == ban_inv) || (namesArray[i] == ban_trans)) || (scannedarray.includes(namesArray[i])))continue;
            name += namesArray[i];
            scannedarray.push(namesArray[i]);
        }
    }
    return name
  }

  var currentVariableId = 0;
  var model = {
    input: {
      expression: "",
      juliaVars:{},

      Matrices:{
        Name:"",
        Columns:"",
        Rows:"",
        Properties:[],
      },
      Vectors:{
        Name:"",
        size:"",
      },
      error: "",
    },
    output: {
      fullCode: "",
      error: ""
    },
    req: null,

    inputViews: [],
    outputViews: [],
    reqViews: [],

    mat_IDs: [],
    vec_IDs: [],
    all_IDs: [],
    mat_GEN: [],
    vec_GEN: [],
    all_IDs_GEN: [],

    addInputView: function(newView) {
      model.inputViews.push(newView);
      newView(400);
    },
    updateInputViews: function() {
      for (v in model.inputViews) {
        model.inputViews[v](400);
      }
    },
    addOutputView: function(newView) {
      model.outputViews.push(newView);
      newView(0);
    },
    updateOutputViews: function() {
      for (v in model.outputViews) {
        model.outputViews[v](0);
      }
    },

    setInput: function(expression) {
      out("starting setInput!!!!");
      var inputExpr;
      var temp_1;
      var temp_2 = [];
      model.setOutput("", "");

      model.input.expression = expression;
      if (model.input.expression.length > 256) {
        model.input.juliaVars = {};
        model.input.error = "Input expression is too long";
      } else {
        inputExpr = getVarNamesFromString(expression.trim());
        inputExpr = inputExpr.replace(/\s/g, '');

        if(inputExpr.includes(',')){
          temp_1 = inputExpr.split(',');
          var temp1 = temp_1.filter(function (el) {
            return el != "";
          })
          model.input.juliaVars = temp1;
        }else{
          temp_2.push(inputExpr);
          var temp2 = temp_2.filter(function (el) {
            return el != "";
          })
          model.input.juliaVars = [temp2];
        }
        model.input.error = "";

      }
      model.updateInputViews();
    },
    setOutput: function(fullCode, error) {
      model.output = { fullCode: fullCode, error: error };
      model.updateOutputViews();
    },
    setReq: function(req) {
      model.req = req;
      model.updateReqViews();
    },

    cancelReq: function() {
      if (model.req) {
        if (model.req.readyState !== 4) {
          model.req.abort();
        }
        model.setReq(null);
      }
    },
    getError: function() {
      return (model.output.error !== "") ? model.output.error : model.input.error;
    }
  };

  var txtExprView = {
  timerEvent: null,

  updateView: function(timeout) {
      clearTimeout(txtExprView.timerEvent);
      $("#txtExpr").parent().removeClass('is-invalid');
    }
  };

  var tblFormatsView = {
    cache: {},
    addmoreIDs: [],
    timerEvent: null,

    insertCacheEntry: function(tensor, format) {
      tblFormatsView.cache[tensor] = format;
    },
    createCacheEntry: function(listId) {
      console.log("listId is " + listId);
      var dims = $("#" + listId).sortable("toArray");
      var formats = [];
      var ordering = [];

      for (var i = 1; i < dims.length; ++i) {
        formats.push($("#" + dims[i] + "_select").attr("data-val"));
        ordering.push(parseInt(dims[i].split("_")[1]));
      }

      return { formats: formats, ordering: ordering };
    },
    updateView: function(timeout) {
      clearTimeout(tblFormatsView.timerEvent);
      if (model.getError() !== "") {
        var hideTable = function() { $("#tblFormats").hide(); };
        tblFormatsView.timerEvent = setTimeout(hideTable, timeout);
      } else {
        var listLinneaBody = "";
        model.input.test = [];
        model.mat_GEN = [];
        model.vec_GEN = [];
        model.all_IDs_GEN = [];
        for (j in model.input.juliaVars) {
          var variable = model.input.juliaVars[j];
          
          if(/^[A-Z]/.test(variable)){
           
            var matricecreator = [];
            model.input.test.push({id:j, name:variable});

            var M_TD_ID_1 = "M_TD_ID_1_J_" + j;
            var M_TD_1_DIV_1 = "M_TD_1_DIV_1_J_" + j;
            var M_TD_1_DIV_INP_1  = "M_TD_1_DIV_INP_1_J_" + j;

            var M_TD_ID_2 = "M_TD_ID_2_J_" + j;

            var M_TD_2_UL_1 = "M_TD_2_UL_1_J_" + j;
            var M_TD_2_UL_LI_1 = "M_TD_2_UL_LI_1_J_" + j;

            var M_R_TD_2_UL_LI_2 = "M_R_TD_2_UL_LI_2_J_" + j;
            var M_R_TD_2_UL_LI_2_DIV_1 = "M_R_TD_2_UL_LI_2_DIV_1_J_" + j;
            var M_R_TD_2_UL_LI_2_DIV_INP_1 = "M_R_TD_2_UL_LI_2_DIV_INP_1_J_" + j;

            var M_C_TD_2_UL_LI_2 = "M_C_TD_2_UL_LI_2_J_" + j;
            var M_C_TD_2_UL_LI_2_DIV_1 = "M_C_TD_2_UL_LI_2_DIV_1_J_" + j;
            var M_C_TD_2_UL_LI_2_DIV_INP_1 = "M_C_TD_2_UL_LI_2_DIV_INP_1_J_" + j;

            var M_P_TD_2_UL_LI_2 = "M_P_TD_2_UL_LI_2_J_" + j;
            var M_P_TD_2_UL_LI_2_DIV_1 = "M_P_TD_2_UL_LI_2_DIV_1_J_" + j;
            var M_P_TD_2_UL_LI_2_DIV_INP_1 = "M_P_TD_2_UL_LI_2_DIV_INP_1_J_" + j;

            var M_P_TD_2_UL_LI_2_DIV_B_1 = "M_P_TD_2_UL_LI_2_DIV_B_1_J_" + j;

            matricecreator.push(variable);
            matricecreator.push(M_R_TD_2_UL_LI_2_DIV_INP_1);
            model.all_IDs.push(M_R_TD_2_UL_LI_2_DIV_INP_1);
            matricecreator.push(makeid(3));
            matricecreator.push(M_C_TD_2_UL_LI_2_DIV_INP_1);
            model.all_IDs.push(M_C_TD_2_UL_LI_2_DIV_INP_1);
            matricecreator.push(makeid(3));
            matricecreator.push(M_P_TD_2_UL_LI_2_DIV_INP_1);
            model.all_IDs.push(M_P_TD_2_UL_LI_2_DIV_INP_1);
            model.mat_IDs.push(matricecreator);

            listLinneaBody += "<tr>";
            listLinneaBody += "<td id=\"";
            listLinneaBody += M_TD_ID_1;
            listLinneaBody += "\" class=\"mdl-data-table__cell--non-numeric\" ";
            listLinneaBody += "width=\"100\" style=\"padding: 0px\">";
            listLinneaBody += "<div align=\"left\" ";
            listLinneaBody += "style=\"font-size: 16px\">";
            listLinneaBody += "<ul id=\"";
            listLinneaBody += "\" class=\"ui-state-default sortable\">";
            listLinneaBody += "<li id=\"";
            listLinneaBody += "\ class=\"ui-state-default\" ";
            listLinneaBody += "style=\"width: 0px; padding: 0px\"></li>";
            listLinneaBody += "<li id=\"";
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += M_TD_1_DIV_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input style=\"text-align: center; font-size: 11px; color: purple;\" class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += M_TD_1_DIV_INP_1;

            listLinneaBody += "\" type=\"text\" readonly ";
            listLinneaBody += "value=\" Matrix";
            listLinneaBody += "\" data-val=\" Matrix";
            listLinneaBody += "\"/>";
            listLinneaBody += "<label = style=\"text-align: center; font-family: sans-serif; font-size: 16px; color:black;\" class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += M_TD_1_DIV_INP_1;
            listLinneaBody += "\">";
            listLinneaBody += variable;
            listLinneaBody += "</label>";
            listLinneaBody += "<ul style=\"text-align: center;\" class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";
            listLinneaBody += "</ul></div></li></ul>";

            listLinneaBody += "<td id=\"";
            listLinneaBody += M_TD_ID_2;
            listLinneaBody += "\" class=\"mdl-data-table__cell--non-numeric\" ";
            listLinneaBody += "style=\"padding: 0px\">";
            listLinneaBody += "<ul id=\"";
            listLinneaBody += M_TD_2_UL_1;
            listLinneaBody += "\" class=\"ui-state-default sortable\">";
            listLinneaBody += "<li id=\"";
            listLinneaBody += M_TD_2_UL_LI_1;
            listLinneaBody += "\" class=\"ui-state-default\" ";
            listLinneaBody += "style=\"width: 0px; padding: 0px\"></li>";

          

            listLinneaBody += "<li id=\"";
            listLinneaBody += M_R_TD_2_UL_LI_2;
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += M_R_TD_2_UL_LI_2_DIV_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += M_R_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\" type=\"text\"  ";

            if (model.input.expression == examples.input1.code && variable == 'X'){
              listLinneaBody += "value=\"1500";
            }else if(model.input.expression == examples.input2.code && variable == "X"){
              listLinneaBody += "value=\"2500";
            }else if(model.input.expression == examples.input2.code && variable == "S"){
              listLinneaBody += "value=\"2500";
            }else if(model.input.expression == examples.input3.code && variable == "L00"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input3.code && variable == "L11"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == examples.input3.code && variable == "L22"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input3.code && variable == "L21"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input3.code && variable == "L10"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == examples.input3.code && variable == "L20"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input3.code && variable == "X21"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input3.code && variable == "X11"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == examples.input3.code && variable == "X10"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == examples.input3.code && variable == "X20"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input4.code && variable == "H"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input4.code && variable == "H_dag"){
              listLinneaBody += "value=\"5000";
            }else if(model.input.expression == examples.input4.code && variable == "I"){
              listLinneaBody += "value=\"5000";
            }else if(model.input.expression == examples.input5.code && variable == "Wk"){
              listLinneaBody += "value=\"5000";
            }else if(model.input.expression == examples.input5.code && variable == "A"){
              listLinneaBody += "value=\"5000";
            }else if(model.input.expression == examples.input5.code && variable == "Bin"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input5.code && variable == "Bout"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input5.code && variable == "In"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input5.code && variable == "I1"){
              listLinneaBody += "value=\"1";
            }else{
              listLinneaBody += "value=\"";
              
            }

            listLinneaBody += "\" style=\"font-size: 13px\" data-val=\"";
            listLinneaBody += "\"/>";
            listLinneaBody += "<label class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += M_R_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\">Rows: ";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";

            listLinneaBody += "</ul></div></li>";



            listLinneaBody += "<li id=\"";
            listLinneaBody += M_C_TD_2_UL_LI_2;
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += M_C_TD_2_UL_LI_2_DIV_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += M_C_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\" type=\"text\"  ";

            if (model.input.expression == examples.input1.code && variable == "X"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input2.code && variable == "X"){
              listLinneaBody += "value=\"500";
            }else if(model.input.expression == examples.input2.code && variable == "S"){
              listLinneaBody += "value=\"2500";
            }else if(model.input.expression == examples.input3.code && variable == "L00"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input3.code && variable == "L11"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == examples.input3.code && variable == "L22"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input3.code && variable == "L21"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == examples.input3.code && variable == "L10"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input3.code && variable == "L20"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input3.code && variable == "X21"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == examples.input3.code && variable == "X11"){
              listLinneaBody += "value=\"200";
            }else if(model.input.expression == examples.input3.code && variable == "X10"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input3.code && variable == "X20"){
              listLinneaBody += "value=\"2000";
            }else if(model.input.expression == examples.input4.code && variable == "H"){
              listLinneaBody += "value=\"5000";
            }else if(model.input.expression == examples.input4.code && variable == "H_dag"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input4.code && variable == "I"){
              listLinneaBody += "value=\"5000";
            }else if(model.input.expression == examples.input5.code && variable == "Wk"){
              listLinneaBody += "value=\"1";
            }else if(model.input.expression == examples.input5.code && variable == "A"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input5.code && variable == "Bin"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input5.code && variable == "Bout"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input5.code && variable == "In"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input5.code && variable == "I1"){
              listLinneaBody += "value=\"1";
            }else{
              listLinneaBody += "value=\"";
            }

            listLinneaBody += "\" style=\"font-size: 13px\" data-val=\"";
            listLinneaBody += "\"/>";
            listLinneaBody += "<label class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += M_C_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\">Columns: ";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";

            listLinneaBody += "</ul></div></li>";


            listLinneaBody += "<li style=\"width: 9px\" class=\"\">";
            listLinneaBody += "<div class=\"\">";
            listLinneaBody += "</div></li>";

            

            listLinneaBody += "<li id=\"";
            listLinneaBody += M_P_TD_2_UL_LI_2;
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += M_P_TD_2_UL_LI_2_DIV_1;
            listLinneaBody += "\" class=\"content mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input extrawide\" placeholder=\"None\"id=\"";
            listLinneaBody += M_P_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\" type=\"text\" name=\"property\" ";

            if (model.input.expression == examples.input1.code && variable == "X"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == examples.input2.code && variable == "X"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == examples.input2.code && variable == "S"){
              listLinneaBody += "value=\"SPD";
            }else if(model.input.expression == examples.input3.code && variable == "L00"){
              listLinneaBody += "value=\"FullRank, LowerTriangular";
            }else if(model.input.expression == examples.input3.code && variable == "L11"){
              listLinneaBody += "value=\"FullRank, LowerTriangular";
            }else if(model.input.expression == examples.input3.code && variable == "L22"){
              listLinneaBody += "value=\"FullRank, LowerTriangular";
            }else if(model.input.expression == examples.input3.code && variable == "L21"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == examples.input3.code && variable == "L10"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == examples.input3.code && variable == "L20"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == examples.input3.code && variable == "X21"){
              listLinneaBody += "value=\"";
            }else if(model.input.expression == examples.input3.code && variable == "X11"){
              listLinneaBody += "value=\"";
            }else if(model.input.expression == examples.input3.code && variable == "X10"){
              listLinneaBody += "value=\"";
            }else if(model.input.expression == examples.input3.code && variable == "X20"){
              listLinneaBody += "value=\"";
            }else if(model.input.expression == examples.input4.code && variable == "H"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == examples.input4.code && variable == "H_dag"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == examples.input5.code && variable == "Wk"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == examples.input5.code && variable == "A"){
              listLinneaBody += "value=\"FullRank";
            }else if(model.input.expression == examples.input5.code && variable == "Bin"){
              listLinneaBody += "value=\"SPD";
            }else if(model.input.expression == examples.input5.code && variable == "Bout"){
              listLinneaBody += "value=\"SPD";
            }else{
              listLinneaBody += "value=\"";
            }

            listLinneaBody += "\" data-val=\"";
            listLinneaBody += "\" style=\"font-size: 11px\">";
            //disabled/
            listLinneaBody += "<label class=\"mdl-textfield__label extrawide\" for=\"";
            listLinneaBody += M_P_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\">Properties:";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";

            listLinneaBody += "</ul>"



            listLinneaBody += "<button onclick='addProperty(this," + j + ")' id=\"";
            //listLinneaBody += "<button onclick='addProperty(this)' id=\"";

            listLinneaBody += "addmore";
            listLinneaBody += "\" class=\"mdl-button mdl-js-button mdl-button--icon\"";
            listLinneaBody += "style=\"position: absolute; margin-left: 258px;\">";




            listLinneaBody += "<i class=\"material-icons\">add</i><div class=\"mdl-tooltip\" data-mdl-for=\"addmore\">Examples</div></button>";


            listLinneaBody += "</div>";
            listLinneaBody += "</li>";
          
          }
          else {
            // for Variable IDS
            var V_TD_ID_1 = "V_TD_ID_1_J_" + j;
            var V_TD_1_DIV_1 = "V_TD_1_DIV_1_J_" + j;
            var V_TD_1_DIV_INP_1  = "V_TD_1_DIV_INP_1_J_" + j;

            var V_TD_ID_2 = "V_TD_ID_2_J_" + j;
            var V_TD_UL_ID_1 = "V_TD_UL_ID_1_J_" + j;
            var V_TD_UL_LI_ID_1 = "V_TD_UL_LI_ID_1_J_" + j;

            // for Column-Row Vector IDS
            var ADD_CLMNVEC_LI_1 = "ADD_CLMNVEC_LI_1" + j;
            var ADD_CLMNVEC_LI_DIV_1 = "ADD_CLMNVEC_LI_DIV_1" + j;
            var ADD_CLMNVEC_LI_DIV_INP_1 = "ADD_CLMNVEC_LI_DIV_INP_1" + j;

            // for size IDS
            var V_TD_UL_LI_ID_2 = "V_TD_UL_LI_ID_2_J_" + j;
            var V_TD_UL_LI_DIV_ID_1 = "V_TD_UL_LI_DIV_ID_1_J_" + j;
            var V_TD_UL_LI_DIV_INP_ID_1 = "V_TD_UL_LI_DIV_INP_ID_1_J_" + j;

            var vectorCreator = [];

            vectorCreator.push(variable);

            vectorCreator.push(V_TD_1_DIV_INP_1);
            model.all_IDs.push(V_TD_1_DIV_INP_1);
            vectorCreator.push(makeid(3));

            vectorCreator.push(V_TD_UL_LI_DIV_INP_ID_1);
            model.all_IDs.push(V_TD_UL_LI_DIV_INP_ID_1);
            vectorCreator.push(makeid(3));

            vectorCreator.push(ADD_CLMNVEC_LI_DIV_INP_1);
            model.all_IDs.push(ADD_CLMNVEC_LI_DIV_INP_1);
            vectorCreator.push(makeid(3));

            model.vec_IDs.push(vectorCreator);

            // Variable name
            listLinneaBody += "<tr>";
            listLinneaBody += "<td id=\"";
            listLinneaBody += V_TD_ID_1;
            listLinneaBody += "\" class=\"mdl-data-table__cell--non-numeric\" ";
            listLinneaBody += "width=\"100\" style=\"padding: 0px\">";
            listLinneaBody += "<div align=\"left\" ";
            listLinneaBody += "style=\"font-size: 16px\">";
            listLinneaBody += "<ul id=\"";
            listLinneaBody += "\" class=\"ui-state-default sortable\">";
            listLinneaBody += "<li id=\"";
            listLinneaBody += "\ class=\"ui-state-default\" ";
            listLinneaBody += "style=\"width: 0px; padding: 0px\"></li>";
            listLinneaBody += "<li id=\"";
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += V_TD_1_DIV_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input onchange='hideScalarDisplay(this," + ADD_CLMNVEC_LI_DIV_1 + ")' style=\"text-align: center; font-size: 11px; color: purple;\" class=\"format-input mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += V_TD_1_DIV_INP_1;

            listLinneaBody += "\" type=\"text\" readonly ";

            if (model.input.expression == examples.input5.code && variable == "k"){
              out("in if");
              listLinneaBody += "value=\" Scalar";
              listLinneaBody += "\" data-val=\" Scalar";
              listLinneaBody += "\"/>";
            }else{
              listLinneaBody += "value=\" Vector";
              listLinneaBody += "\" data-val=\" Vector";
              listLinneaBody += "\"/>";
            }

            listLinneaBody += "<label = style=\"font-family: sans-serif;  text-align: center; font-size: 16px; color:black;\" class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += V_TD_1_DIV_INP_1;
            listLinneaBody += "\">";
            listLinneaBody += variable;
            listLinneaBody += "</label>";
            listLinneaBody += "<ul ";
            listLinneaBody += " style=\"text-align: center;background-color: #dfeaf4;\" class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += V_TD_1_DIV_INP_1;
            listLinneaBody += "\">";
            listLinneaBody += "<li  style=\"margin-left: 23px;font-size: 11px; \" class=\"mdl-menu__item show\" data-val=\"";
            listLinneaBody += "Vector\" >Vector</li>";
            listLinneaBody += "<li style=\"margin-left: 23px;font-size: 11px;\" class=\"mdl-menu__item\" data-val=\"";
            listLinneaBody += "Scalar\" >Scalar</li>";
            listLinneaBody += "</ul></div></li></ul>";

            //listLinneaBody += variable;
            //listLinneaBody += "</div><span id=\"\"  style=\" font-size:10px; color: purple;\">Vector</span></td>";

            // Check later what ?????
            listLinneaBody += "<td id=\"";
            listLinneaBody += V_TD_ID_2;
            listLinneaBody += "\" class=\"mdl-data-table__cell--non-numeric\" ";
            listLinneaBody += "style=\"padding: 0px\">";
            listLinneaBody += "<ul id=\"";
            listLinneaBody += V_TD_UL_ID_1;
            listLinneaBody += "\" class=\"ui-state-default sortable\">";
            listLinneaBody += "<li id=\"";
            listLinneaBody += V_TD_UL_LI_ID_1;
            listLinneaBody += "\ class=\"ui-state-default\" ";
            listLinneaBody += "style=\"width: 0px; padding: 0px\"></li>";



            // Size of the Vector
            listLinneaBody += "<li id=\"";
            listLinneaBody += V_TD_UL_LI_ID_2;
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\""
            listLinneaBody += V_TD_UL_LI_DIV_ID_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += V_TD_UL_LI_DIV_INP_ID_1;
            listLinneaBody += "\" type=\"text\"  ";

            if (model.input.expression == examples.input1.code && variable == "y"){
              listLinneaBody += "value=\"1500";
            }else if(model.input.expression == examples.input2.code && variable == "z"){
              listLinneaBody += "value=\"500";
            }else if(model.input.expression == examples.input2.code && variable == "y"){
              listLinneaBody += "value=\"2500";
            }else if(model.input.expression == examples.input1.code && variable == "b"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input4.code && variable == "y_k"){
              listLinneaBody += "value=\"5000";
            }else if(model.input.expression == examples.input4.code && variable == "y"){
              listLinneaBody += "value=\"1000";
            }else if(model.input.expression == examples.input4.code && variable == "x"){
              listLinneaBody += "value=\"5000";
            }else{
              listLinneaBody += "value=\"";
            }


            listLinneaBody += "\" style=\"font-size: 13px\" data-val=\"";
            listLinneaBody += "\"/>";
            listLinneaBody += "</label>";
            listLinneaBody += "<label class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += V_TD_UL_LI_DIV_INP_ID_1;
            listLinneaBody += "\">Size: ";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";
            listLinneaBody += "</ul></div></li>";

            // Column Vector or Row Vector
            listLinneaBody += "<li id=\"";
            listLinneaBody += ADD_CLMNVEC_LI_1;
            listLinneaBody += "\" class=\"ui-state-default\">";
            
            listLinneaBody += "<div id=\"";
            listLinneaBody += ADD_CLMNVEC_LI_DIV_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            if (model.input.expression == examples.input5.code && variable == "k"){
              listLinneaBody += "style=\"display: none;\"";
            }else{
              listLinneaBody += "style=\"display: block;\"";
            }
            listLinneaBody += ">";
            listLinneaBody += "<input style=\"font-size: 11px\" class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += ADD_CLMNVEC_LI_DIV_INP_1;
            listLinneaBody += "\" type=\"text\" readonly ";
            listLinneaBody += "value=\"Column Vector";
            listLinneaBody += "\" data-val=\"Column Vector";
            listLinneaBody += "\"/>";
            listLinneaBody += "<label class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += ADD_CLMNVEC_LI_DIV_INP_1;
            listLinneaBody += "\">Type: ";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += ADD_CLMNVEC_LI_DIV_INP_1;
            listLinneaBody += "\">";
            listLinneaBody += "<li class=\"mdl-menu__item\" style=\"font-size: 11px\" data-val=\"";
            listLinneaBody += "d\">Row Vector</li>";
            listLinneaBody += "<li class=\"mdl-menu__item\" style=\"font-size: 11px\" data-val=\"";
            listLinneaBody += "s\">Column Vector</li>";
            listLinneaBody += "</ul></div></li>";
          }
          listLinneaBody += "</ul></td></tr>";
        }

        if (listLinneaBody !== "") {
          //out("begin the table initialization!!!!");
          $("#listLinneas").html(listLinneaBody);
          getmdlSelect.init(".getmdl-select");
          model.mat_GEN = model.mat_IDs.slice();
          model.mat_IDs = [];
          model.vec_GEN = model.vec_IDs.slice();
          model.vec_IDs = [];

          model.all_IDs_GEN = model.all_IDs.slice();
          //out(model.all_IDs_GEN);
          model.all_IDs = [];
          //out("up sortable");
          $(".sortable").sortable({
            update: function(ev, ui) {
              var listId = ui.item.parent().attr('id');
              var tensor = listId.replace("dims", "");

              console.log('listId in sortable is: ' + listId);
              console.log('tensor in sortable is: ' + tensor);

              console.log('1');
              // tblFormatsView.insertCacheEntry(tensor, 
              //     tblFormatsView.createCacheEntry(listId));
              
              model.cancelReq();
              model.setOutput("", "", "", "");
            }
         });
         $(".format-input").change(function() {
          console.log('inputchange!!!!');
          // var listId = $(this).parent().parent().parent().attr('id');
          // var tensor = listId.replace("dims", "");

          // console.log('listId in inputchange is: ' + listId);
          // console.log('tensor in inputchange is: ' + tensor);

          // console.log('2');
          // // tblFormatsView.insertCacheEntry(tensor, 
          //     tblFormatsView.createCacheEntry(listId));
          
          model.cancelReq();
          model.setOutput("", "", "", "");
        });
        // for (t in model.input.juliaVars) {
        //   if (model.input.juliaVars[t]) {
        //     console.log('3');
        //     tblFormatsView.insertCacheEntry(model.input.juliaVars[t], 
        //         tblFormatsView.createCacheEntry("dims" + model.input.juliaVars[t]));
        //   }
        // }


          $("#tblFormats").show();
        } else {
          $("#tblFormats").hide();
        }
      }
    }
  };

  model.addInputView(txtExprView.updateView);
  model.addInputView(tblFormatsView.updateView);
  //model.addInputView(btnGetKernelView.updateView);



  model.addOutputView(txtExprView.updateView);
  //model.addOutputView(panelKernelsView.updateView);
  //model.addOutputView(btnDownloadView.updateView);


  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }


  function hideScalarDisplay(object, id){


    out($(object).val());
    if($(object).val() == 'Vector'){
      id.style.display = 'block';
    }else if($(object).val() == 'Scalar'){
      id.style.display = 'none';
    }

  }

  var favorite = [];
  var inputInto = "";
  function addProperty(object, id){
    currentVariableId = id;
    modal.style.display = "block";
    var thisID = $(object).attr('id');
    out($(object).val());
    inputInto = $(object).closest("div.content").find("input").attr('id');
    listofproperties = $('#'+inputInto).val().trim().split(',');
    out(listofproperties);
    //out('this id is: ' + thisID);
    $('input:checkbox').removeAttr('checked');

    for(lst in listofproperties){
        out($('#'+listofproperties[lst].trim()));
        $('#'+listofproperties[lst].trim()).prop('checked', true);
        //$("input[name='listofproperties[lst]']:checked");
    }

    $.each($("input[name='properties']:checked"), function(){
      favorite.push($(this).val());
    });
    listofproperties = [];
  }

  function saveProperty(request){
    var favorite = [];
    $("input:checkbox[name='properties']:checked").each(function(){
     favorite.push($(this).val());
    });
    var properties = favorite.join(", ");
    $('#'+inputInto).val(properties).trigger('inputchange');
    var parentID = $(this).closest('li').attr('id');
    modal.style.display = "none";
    inputInto = " ";
    favorite = [];
    //out(favorite);
  }

  function clearProperty(request){
    var properties = "";
    $('#'+inputInto).val(properties).trigger('inputchange');
    var parentID = $(this).closest('li').attr('id');

    // save your value where you want
    modal.style.display = "none";
    inputInto = " ";

  }



  function generateInput(){
    var inputGenerated = "";
    inputGenerated += "\n"
    out(model.mat_GEN);
    out(model.vec_GEN);

    if(model.mat_GEN  !== undefined && model.mat_GEN.length != 0){
      var i=0;
      var j=0;
      for (i; i < model.mat_GEN.length; i++){

        inputGenerated += model.mat_GEN[i][2];
        inputGenerated += " = ";
        inputGenerated += $('#'+model.mat_GEN[i][1]).val();
        inputGenerated += "\n";

        inputGenerated += model.mat_GEN[i][4];
        inputGenerated += " = ";
        inputGenerated += $('#'+model.mat_GEN[i][3]).val();
        inputGenerated += "\n";

      }
    }

    if(model.vec_GEN !== undefined && model.vec_GEN.length != 0){
      var i=0;
      var j=0;
      for (i; i<model.vec_GEN.length; i++){
        if($('#'+model.vec_GEN[i][1]).val().trim() !== "Scalar"){
          inputGenerated += model.vec_GEN[i][4];
          inputGenerated += " = ";
          inputGenerated += $('#'+model.vec_GEN[i][3]).val();
          inputGenerated += "\n";
        }
      }
    }


    if(model.mat_GEN  !== undefined && model.mat_GEN.length != 0){
      var i=0;
      var j=0;
      for (i; i< model.mat_GEN.length; i++){
        inputGenerated += "Matrix " + model.mat_GEN[i][0] + "(" + model.mat_GEN[i][2] + ", " + model.mat_GEN[i][4] + ")" + ' <' + $('#'+model.mat_GEN[i][5]).val() +">";
        inputGenerated += "\n";
      }
    }

    if(model.vec_GEN  !== undefined && model.vec_GEN.length != 0){
      var i=0;
      var j=0;
      out(model.vec_GEN);
      for (i; i< model.vec_GEN.length; i++){
        out('this is identifier' + $('#'+model.vec_GEN[i][1]).val() + ';');
        out('this is identifier' + $('#'+model.vec_GEN[i][5]).val() + ';');
        out(typeof($('#'+model.vec_GEN[i][1]).val()));
        out(typeof("Scalar"));
        out($('#'+model.vec_GEN[i][1]).val() == "Scalar");
        if($('#'+model.vec_GEN[i][1]).val().trim() == "Scalar"){
          out('in scalar');
          inputGenerated += "Scalar " + model.vec_GEN[i][0] + "<>";
          inputGenerated += "\n";
        }else{
          if($('#'+model.vec_GEN[i][5]).val() == 'Row Vector'){
            inputGenerated += "Row Vector " + model.vec_GEN[i][0] + "(" + model.vec_GEN[i][4] + ")<>";
            inputGenerated += "\n";
          }else{
            inputGenerated += "ColumnVector " + model.vec_GEN[i][0] + "(" + model.vec_GEN[i][4] + ")<>";
            inputGenerated += "\n";

          }        
        }
      }
    }
    inputGenerated += model.input.expression;

    out('inputGenerated is ' + inputGenerated);
    out("\n");
    out("hidden input value before assign: " + $("#description").val());
    $("#description").val(inputGenerated);
    out("hidden input value after assign: " + $("#description").val());


  }

  function downloadOutput(){
    out("in download!")
    var blob = new Blob([$('#txtComputeLoops').val()],
              {type: "text/plain;charset=utf-8"});
    saveAs(blob, "Linnea_Algorithm.jl");
  }

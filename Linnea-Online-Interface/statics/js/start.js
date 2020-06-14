
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
      var formats = [];
      var ordering = [];

      for (var i = 0; i < listId.length; ++i) {
        formats.push($("#" + listId[i]).val());
        ordering.push(listId[i]);
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
          var cached = (tblFormatsView.cache.hasOwnProperty(model.input.juliaVars[j]) && 1);

          if(/^[A-Z]/.test(variable)){
           
            var matricecreator = [];
            model.input.test.push({id:j, name:variable});

            var name = "M_NAME_" + j;
            var M_TD_INP_1 = "M_" + j + "_0";

            var M_R_TD_2_UL_LI_2_DIV_INP_1 = "M_" + j + "_1";
            var M_C_TD_2_UL_LI_2_DIV_INP_1 = "M_" + j + "_2";
            var M_P_TD_2_UL_LI_2_DIV_INP_1 = "M_" + j + "_3";

            matricecreator.push(variable);
            matricecreator.push(M_R_TD_2_UL_LI_2_DIV_INP_1);
            //model.all_IDs.push(M_R_TD_2_UL_LI_2_DIV_INP_1);
            matricecreator.push(makeid(3));
            matricecreator.push(M_C_TD_2_UL_LI_2_DIV_INP_1);
            //model.all_IDs.push(M_C_TD_2_UL_LI_2_DIV_INP_1);
            matricecreator.push(makeid(3));
            matricecreator.push(M_P_TD_2_UL_LI_2_DIV_INP_1);
            //model.all_IDs.push(M_P_TD_2_UL_LI_2_DIV_INP_1);
            model.mat_IDs.push(matricecreator);

            var mat_ID_cache = [];
            mat_ID_cache.push(M_R_TD_2_UL_LI_2_DIV_INP_1, M_C_TD_2_UL_LI_2_DIV_INP_1, M_P_TD_2_UL_LI_2_DIV_INP_1);
            model.all_IDs.push(mat_ID_cache);
            mat_ID_cache = [];

            var format_R = cached ? tblFormatsView.cache[variable].formats[0] : "0";
            var format_C = cached ? tblFormatsView.cache[variable].formats[1] : "0";
            var format_P = cached ? tblFormatsView.cache[variable].formats[2] : "";
              

            listLinneaBody += "<tr>";
            listLinneaBody += "<td id=\"";
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
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input style=\"text-align: center; font-size: 11px; color: purple;\" class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += M_TD_INP_1;
            listLinneaBody += "\" type=\"text\" readonly ";
            listLinneaBody += "value=\" Matrix";
            listLinneaBody += "\" data-val=\" Matrix";
            listLinneaBody += "\"/>";
            listLinneaBody += "<label id=\"";
            listLinneaBody += name;
            listLinneaBody += "\" style=\"text-align: center; font-family: sans-serif; font-size: 16px; color:black;\" class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += M_TD_INP_1;
            listLinneaBody += "\">";
            listLinneaBody += variable;
            listLinneaBody += "</label>";
            listLinneaBody += "<ul style=\"text-align: center;\" class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";
            listLinneaBody += "</ul></div></li></ul>";

            listLinneaBody += "<td id=\"";
            listLinneaBody += "\" class=\"mdl-data-table__cell--non-numeric\" ";
            listLinneaBody += "style=\"padding: 0px\">";
            listLinneaBody += "<ul id=\"";
            listLinneaBody += "\" class=\"ui-state-default sortable\">";
            listLinneaBody += "<li id=\"";
            listLinneaBody += "\" class=\"ui-state-default\" ";
            listLinneaBody += "style=\"width: 0px; padding: 0px\"></li>";

            listLinneaBody += "<li id=\"";
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += M_R_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\" type=\"text\" ";

            listLinneaBody += "value=\"";
            listLinneaBody += format_R;
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
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += M_C_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\" type=\"text\"  ";

            listLinneaBody += "value=\"";
            listLinneaBody += format_C;
 
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
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\"";
            listLinneaBody += "\" class=\"content mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input extrawide\" placeholder=\"None\"id=\"";
            listLinneaBody += M_P_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\" type=\"text\" name=\"property\" ";

            listLinneaBody += "value=\"";
            listLinneaBody += format_P;

            listLinneaBody += "\" data-val=\"";
            listLinneaBody += "\" style=\"font-size: 11px\">";
            listLinneaBody += "<label class=\"mdl-textfield__label extrawide\" for=\"";
            listLinneaBody += M_P_TD_2_UL_LI_2_DIV_INP_1;
            listLinneaBody += "\">Properties:";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";

            listLinneaBody += "</ul>"



            listLinneaBody += "<button onclick='addProperty(this," + j + ")' id=\"";

            listLinneaBody += "addmore";
            listLinneaBody += "\" class=\"mdl-button mdl-js-button mdl-button--icon\"";
            listLinneaBody += "style=\"position: absolute; margin-left: 258px;\">";




            listLinneaBody += "<i class=\"material-icons\">add</i><div class=\"mdl-tooltip\" data-mdl-for=\"addmore\">Examples</div></button>";


            listLinneaBody += "</div>";
            listLinneaBody += "</li>";
          
          }
          else {
            // for Variable IDS

            var name = "V_NAME_" + j;
            
            var V_TD_ID_1 = "V_TD_ID_1_J_" + j;
            var V_TD_1_DIV_1 = "V_TD_1_DIV_1_J_" + j;
            var V_TD_1_DIV_INP_1  = "V_" + j + "_1";

            var V_TD_ID_2 = "V_TD_ID_2_J_" + j;
            var V_TD_UL_ID_1 = "V_TD_UL_ID_1_J_" + j;
            var V_TD_UL_LI_ID_1 = "V_TD_UL_LI_ID_1_J_" + j;

            // for Column-Row Vector IDS
            var ADD_CLMNVEC_LI_1 = "ADD_CLMNVEC_LI_1" + j;
            var ADD_CLMNVEC_LI_DIV_1 = "ADD_CLMNVEC_LI_DIV_1" + j;
            var ADD_CLMNVEC_LI_DIV_INP_1 = "V_" + j + "_3";

            // for size IDS
            var V_TD_UL_LI_ID_2 = "V_TD_UL_LI_ID_2_J_" + j;
            var V_TD_UL_LI_DIV_ID_1 = "V_TD_UL_LI_DIV_ID_1_J_" + j;
            var V_TD_UL_LI_DIV_INP_ID_1 = "V_" + j + "_2";

            var vectorCreator = [];

            vectorCreator.push(variable);

            vectorCreator.push(V_TD_1_DIV_INP_1);
            //model.all_IDs.push(V_TD_1_DIV_INP_1);
            vectorCreator.push(makeid(3));

            vectorCreator.push(V_TD_UL_LI_DIV_INP_ID_1);
            //model.all_IDs.push(V_TD_UL_LI_DIV_INP_ID_1);
            vectorCreator.push(makeid(3));

            vectorCreator.push(ADD_CLMNVEC_LI_DIV_INP_1);
            //model.all_IDs.push(ADD_CLMNVEC_LI_DIV_INP_1);
            vectorCreator.push(makeid(3));

            model.vec_IDs.push(vectorCreator);

            var vec_ID_cache = [];
            vec_ID_cache.push(V_TD_1_DIV_INP_1, V_TD_UL_LI_DIV_INP_ID_1, ADD_CLMNVEC_LI_DIV_INP_1);
            model.all_IDs.push(vec_ID_cache);
            vec_ID_cache = [];
            
            var format_T = cached ? tblFormatsView.cache[variable].formats[0] : "Vector";
            var format_S = cached ? tblFormatsView.cache[variable].formats[1] : "0";
            var format_CR = cached ? tblFormatsView.cache[variable].formats[2] : "Column Vector";

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

            
            listLinneaBody += "value=\""
            listLinneaBody += format_T;
            listLinneaBody += "\" data-val=\"Vector";
            listLinneaBody += "\"/>";
          

            listLinneaBody += "<label id=\"";
            listLinneaBody += name;
            listLinneaBody += "\" style=\"font-family: sans-serif;  text-align: center; font-size: 16px; color:black;\" class=\"mdl-textfield__label\" for=\"";
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

            listLinneaBody += "value=\"";
            listLinneaBody += format_S;
          
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
            listLinneaBody += "style=\"display: block;\"";
            
            listLinneaBody += ">";
            listLinneaBody += "<input style=\"font-size: 11px\" class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += ADD_CLMNVEC_LI_DIV_INP_1;
            listLinneaBody += "\" type=\"text\" readonly ";
            listLinneaBody += "value=\""
            listLinneaBody += format_CR;
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
          $("#listLinneas").html(listLinneaBody);
          getmdlSelect.init(".getmdl-select");
          model.mat_GEN = model.mat_IDs.slice();
          model.mat_IDs = [];
          model.vec_GEN = model.vec_IDs.slice();
          model.vec_IDs = [];

          model.all_IDs_GEN = model.all_IDs.slice();
          model.all_IDs = [];
          
         $(".format-input").on('inputchange change keyup paste',function() {
          var listId = $(this).attr('id');
          var name = $('#'+listId.charAt(0)+"_NAME_"+listId.charAt(2)).html();
          
          inputArray=[];
          inputArray.push(listId.charAt(0)+'_'+listId.charAt(2)+'_1');
          inputArray.push(listId.charAt(0)+'_'+listId.charAt(2)+'_2');
          inputArray.push(listId.charAt(0)+'_'+listId.charAt(2)+'_3');
          tblFormatsView.insertCacheEntry(name, 
              tblFormatsView.createCacheEntry(inputArray));
          
        });
        for (t in model.input.juliaVars) {
          if (model.input.juliaVars[t]) {
            tblFormatsView.insertCacheEntry(model.input.juliaVars[t], 
                tblFormatsView.createCacheEntry(model.all_IDs_GEN[t]));
          }
        }


          $("#tblFormats").show();
        } else {
          $("#tblFormats").hide();
        }
      }
    }
  };

  var examples = {

    input1:{
      name: "Least Squares",
      expr: "\\(b := (X^TX)^{-1}X^Ty\\)",
      format: {
        b: { formats: ["Vector","1000","Column Vector"] },
        X: { formats: ["1500","1000","FullRank"] },
        y: { formats: ["Vector","1500","Column Vector"] },
      },
      code: "b=inv(trans(X)*X)*trans(X)*y",
    },
    input2:{
      name: "Generalized Least Squares",
      expr: "\\(z := (X^TS^{-1}X)^{-1}X^TS^{-1}y\\)",
      format: {
        X: {formats: ["2500","500","FullRank"]},
        S: {formats: ["2500","2500","SPD"]},
        z: {formats: ["Vector", "500", "Column Vector"]},
        y: {formats: ["Vector", "2500", "Column Vector"]},
      },
      code: "z=inv(trans(X)*inv(S)*X)*trans(X)*inv(S)*y",
    },
    input3:{
      name: "Triangular Matrix Inversion",
      expr: ["\\(X_{10} := L_{10} L_{00}^{-1}\\)" , "\\(X_{20} := L_{20}+L_{22}^{-1}L_{21}L_{11}^{-1}L_{10}\\)","\\(X_{11} := L_{11}^{-1}\\)", "\\(X_{21} := -L_{22}^{-1}L_{21}\\)"],
      format: {
        X10: {formats: ["200", "2000", ""]},
        L10: {formats: ["200", "2000", "FullRank"]},
        L00: {formats: ["2000", "2000", "FullRank, LowerTriangular"]},
        X20: {formats: ["2000", "2000", ""]},
        L20: {formats: ["2000", "2000", "FullRank"]},
        L22: {formats: ["2000", "2000", "FullRank, LowerTriangular"]},
        L21: {formats: ["2000", "200", "FullRank"]},
        L11: {formats: ["200", "200", "FullRank, LowerTriangular"]},
        X11: {formats: ["200", "200", ""]},
        X21: {formats: ["2000", "200", ""]},
      },
      code: "X10=L10*inv(L00)\nX20=L20+(inv(L22)*L21*inv(L11)*L10)\nX11=inv(L11)\nX21=inv(L22)*L21*-1",
    },
    input4:{
      name: "Image Restoration",
      expr: ["\\(H^{\\dagger} := H^{T}(HH^{T})^{-1}\\) ", "\\(y_k := H^{\\dagger}y+(I_n-H^{\\dagger}H)x_k\\)"],
      format: {
        H_dag: {formats: ["5000", "1000", "FullRank"]},
        H: {formats: ["1000", "5000", "FullRank"]},
        y_k: {formats: ["Vector", "5000", "Column Vector"]},
        y: {formats: ["Vector", "1000", "Column Vector"]},
        I: {formats: ["5000", "5000", ""]},
        x: {formats: ["Vector", "5000", "Column Vector"]},
      },
      code: "H_dag=trans(H)*inv(H*trans(H))\ny_k=H_dag*y+(I+(-1*H_dag*H))*x",
    },
    input5:{
      name: "Stochastic Newton",
      expr: ["\\( B_k := \\frac{k}{k-1}B_{k-1} \\Bigl(I_n - A^T W_k \\bigl((k-1)I_l\\)", "\\(+W_k^T A B_{k-1} A^T W_k \\bigr)^{-1} W_k^T A B_{k-1} \\Bigr)\\)"],
      format: {
        Bout: {formats: ["1000", "1000", "SPD"]},
        k: {formats: ["Scalar", "0", ""]},
        Bin: {formats: ["1000", "1000", "SPD"]},
        In: {formats: ["1000", "1000", ""]},
        A: {formats: ["5000", "1000", "FullRank"]},
        Wk: {formats: ["5000", "1", "FullRank"]},
        I1: {formats: ["1", "1", ""]},
      },
      //&+ W_k^T A B_{k-1} A^T W_k \\bigr)^{-1} W_k^T A B_{k-1} \\Bigr)\\end{align}",
      //expr: ["\\(A = (k/k-1)*B_{in}\\)", "\\(B = I_{n}\\)", "\\(C = -A^{T}*W_{k}*W_{k}^{T}*A*B_{in}\\)", "\\(D=(k-1)*I_{1}\\)", "\\(E=W_{k}^{T}*A*B_{in}*A^{T}*B_{in}\\)","\\(B_{out}=A*(B+(C*(D+E)))\\)"],
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
      listExamplesBody += "\" class=\"mdl-menu__item\" style=\"height: 115px;\" >";
      listExamplesBody += "<ul style=\"list-style: none; padding-top: 10px;padding-left: 0px;padding-bottom:10px;font-size: 11px;\"><li class=\"\">";
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
      listExamplesBody += "\" class=\"mdl-menu__item\" style=\"height: 70px; \" >";
      listExamplesBody += "<ul style=\"list-style: none;  padding-top: 10px;padding-left: 0px;padding-bottom:10px;;font-size: 11px;\"><li class=\"\">";
      listExamplesBody += examples[e].name;
      listExamplesBody += ":&nbsp ";
      listExamplesBody += examples[e].expr[0];
      listExamplesBody += "</li><li class=\"\" style=\"padding-left: 116px;\">";
      listExamplesBody += examples[e].expr[1];
      listExamplesBody += "</li></ul></li>";
  
    }else if(examples[e].name == "Stochastic Newton"){
      listExamplesBody += "<li id=\"example_";
      listExamplesBody += e;
      listExamplesBody += "\" class=\"mdl-menu__item\" style=\"height: 70px; font-size: 11px;\">";
      listExamplesBody += "<ul style=\"list-style: none;  padding-top: 10px;padding-left: 0px;padding-bottom:10px;font-size: 11px;\"><li class=\"\">";
      listExamplesBody += examples[e].name;
      listExamplesBody += ":&nbsp ";
      listExamplesBody += examples[e].expr[0];
      listExamplesBody += "</li><li class=\"\" style=\"padding-left: 116px;\">";
      listExamplesBody += examples[e].expr[1];
      
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
  
    (function(code, format) {
      var setExample5 = function() {
        for (var f in format) {
          tblFormatsView.insertCacheEntry(f,format[f]);
        }
        out("4");
        $("#txtExpr").css('height','64px');
        $("#txtExpr").val(code).trigger('inputchange');
        $("#txtExpr").html(code);
        $("#lblError").css('visibility', 'hidden');
        model.setInput(code);
      };
      var setExample4 = function() {
        for (var f in format) {
          tblFormatsView.insertCacheEntry(f,format[f]);
        }
        out("4");
        $("#txtExpr").css('height','64px');
        $("#txtExpr").val(code).trigger('inputchange');
        $("#txtExpr").html(code);
        $("#lblError").css('visibility', 'hidden');
        model.setInput(code);
      };
      var setExample3 = function() {
        for (var f in format) {
          tblFormatsView.insertCacheEntry(f,format[f]);
        }
        out("3");
        $("#txtExpr").css('height','128px');
        $("#txtExpr").val(code).trigger('inputchange');
        $("#txtExpr").html(code);
        $("#lblError").css('visibility', 'hidden');
        model.setInput(code);
      };
      var setExample = function() {
        for (var f in format) {
          tblFormatsView.insertCacheEntry(f,format[f]);
        }
        out("else");
        $("#txtExpr").css('height','32px');
        $("#txtExpr").val(code).trigger('inputchange');
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
  
    })(examples[e].code, examples[e].format);
  }
  

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
    $('#'+inputInto).val(properties).trigger('change');
    var parentID = $(this).closest('li').attr('id');
    modal.style.display = "none";
    inputInto = " ";
    favorite = [];
   
  }

  function clearProperty(request){
    var properties = "";
    $('#'+inputInto).val(properties).trigger('inputchange');
    var parentID = $(this).closest('li').attr('id');

    modal.style.display = "none";
    inputInto = " ";

  }



  function generateInput(){
    var inputGenerated = "";
    inputGenerated += "\n"
    
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
      for (i; i< model.vec_GEN.length; i++){
        if($('#'+model.vec_GEN[i][1]).val().trim() == "Scalar"){
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

    
    
    $("#description").val(inputGenerated);
  }

  function downloadOutput(){
    var blob = new Blob([$('#txtComputeLoops').val()],
              {type: "text/plain;charset=utf-8"});
    saveAs(blob, "Linnea_Algorithm.jl");
  }


// gulp merge javascript files
// LTT
//// scroll into view



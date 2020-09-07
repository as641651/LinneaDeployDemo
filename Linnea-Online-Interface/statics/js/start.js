var sina = 'sina';
var dada = [];
var dm4 = {};
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

function inittxtExpr() {
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


function reverse(str){
  let reversed = "";    
  for (var i = str.length - 1; i >= 0; i--){        
    reversed += str[i];
  }    
  return reversed;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function writedim(object){
  //out(object);
  var var_tag = object.getAttribute("variable");
  var var_id = object.getAttribute("id");
  console.log('This is id: ' + var_id);
  var value = object.value;

  // $('#'+var_id).on('keydown', function(event){
  //   var key = String.fromCharCode(event.which);
  //   if (!event.shiftKey) {
  //       key = key.toLowerCase();
  //   }
  //   $('.two').val( value + key );
  // });​
  //out(dm4);
  //out(var_tag);
  //out(value);
  //out(dm4[var_tag]);
  out($('#'+var_id));
  
  out('hello');
  var ii =0;
  //var value = $(this).val();
  //val = val.replace(/[^\w]+/g, "");
  if(dm4[var_tag] !== undefined){
    for(ii;ii<dm4[var_tag].length;ii++){
      if(var_tag != dm4[var_tag][ii]){      
        $(`input[variable = '${dm4[var_tag][ii]}']` ).html(value).trigger('inputchange');
        $(`input[variable = '${dm4[var_tag][ii]}']`).val(value).trigger('inputchange');
      }
      if($(`input[variable = '${var_tag}']`).val() == $(`input[variable = '${dm4[var_tag][ii]}']`).val()){
        $(`input[variable = '${var_tag}']`).css( "border-bottom", "2px solid #1F7872" );
        $(`input[variable = '${dm4[var_tag][ii]}']`).css( "border-bottom", "2px solid #1F7872" );
      }
    }
  }

  // var ii =0;
  // if(dm4[var_tag] !== undefined){
  //   for(ii;ii<dm4[var_tag].length;ii++){
  //     if(var_tag != dm4[var_tag][ii]){
  //       //out(dm4[var_tag][ii]);
  //       //out(`input[variable = '${dm4[var_tag][ii]}'`);
  //       $(`input[variable = '${dm4[var_tag][ii]}']` ).html(value).trigger('inputchange');
  //       $(`input[variable = '${dm4[var_tag][ii]}']`).val(value).trigger('inputchange');
  //       // $('#'+var_id).on('keydown', function(event){
  //       //   var key = String.fromCharCode(event.which);
  //       //   if (!event.shiftKey) {
  //       //       key = key.toLowerCase();
  //       //   }
  //       //   $(`input[variable = '${dm4[var_tag][ii]}']` ).val( value + key );
  //       // });​
  //     }
  //   }
  // }
  //out(tblFormatsView.cache);
}

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
      ID:{},
      Columns:"",
      Rows:"",
      Properties:[],
    },
    Vectors:{
      ID: {},
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
            if(variable){
              model.input.Matrices.ID += {id:j, name:String(variable)};
            }
            var name = "M_NAME_" + j;
            var M_TD_INP_1 = "M_" + j + "_0";

            var M_R_TD_2_UL_LI_2_DIV_INP_1 = "M_" + j + "_1";
            var M_C_TD_2_UL_LI_2_DIV_INP_1 = "M_" + j + "_2";
            var M_P_TD_2_UL_LI_2_DIV_INP_1 = "M_" + j + "_4";
            
            // for Matrice type IDS
            var ADD_MATTYPE_LI_1 = "ADD_MATTYPE_LI_1" + j;
            var ADD_MATTYPE_LI_DIV_1 = "ADD_MATTYPE_LI_DIV_1" + j;
            var ADD_MATTYPE_LI_DIV_INP_1 = "M_" + j + "_3";

            // for hiding properties
            var ADD_PROPERTY_LI_DIV_1 = "PROPERTY_LI_DIV_1" + j;
            



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
            mat_ID_cache.push(M_R_TD_2_UL_LI_2_DIV_INP_1, M_C_TD_2_UL_LI_2_DIV_INP_1, ADD_MATTYPE_LI_DIV_INP_1, M_P_TD_2_UL_LI_2_DIV_INP_1);
            model.all_IDs.push(mat_ID_cache);
            mat_ID_cache = [];

            var format_R = cached ? tblFormatsView.cache[variable].formats[0] : "100";
            var format_C = cached ? tblFormatsView.cache[variable].formats[1] : "100";
            var format_T = cached ? tblFormatsView.cache[variable].formats[2] : "General";
            var format_P = cached ? tblFormatsView.cache[variable].formats[3] : "";


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

            // Matrice Type
            listLinneaBody += "<li id=\"";
            listLinneaBody += ADD_MATTYPE_LI_1;
            listLinneaBody += "\" class=\"ui-state-default\">";

            listLinneaBody += "<div id=\"";
            listLinneaBody += ADD_MATTYPE_LI_DIV_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            //if(model.input.expression == "Bout=(k*inv(k-1))*Bin*(In+(-1*trans(A)*Wk*inv((k-1)*I1+trans(Wk)*A*Bin*trans(A)*Wk)*trans(Wk)*A*Bin))" && variable == "k"){
            // if(format_T == "Scalar"){
            //   listLinneaBody += "style=\"display: none;\"";
            // }else{
            //   listLinneaBody += "style=\"display: block;\"";
            // }
            listLinneaBody += ">";
            listLinneaBody += "<input onchange='hidePropertyDisplay(this," + ADD_PROPERTY_LI_DIV_1 + ")' style=\"font-size: 11px\" class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += ADD_MATTYPE_LI_DIV_INP_1;
            listLinneaBody += "\" type=\"text\" readonly ";
            listLinneaBody += "value=\""
            listLinneaBody += format_T;
            listLinneaBody += "\" data-val=\"General";
            listLinneaBody += "\"/>";
            listLinneaBody += "<label class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += ADD_MATTYPE_LI_DIV_INP_1;
            listLinneaBody += "\">Type: ";
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += ADD_MATTYPE_LI_DIV_INP_1;
            listLinneaBody += "\">";
            listLinneaBody += "<li class=\"mdl-menu__item\" style=\"font-size: 11px\" data-val=\"";
            listLinneaBody += "d\">General</li>";
            listLinneaBody += "<li class=\"mdl-menu__item\" style=\"font-size: 11px\" data-val=\"";
            listLinneaBody += "s\">Identity</li>";
            listLinneaBody += "<li class=\"mdl-menu__item\" style=\"font-size: 11px\" data-val=\"";
            listLinneaBody += "s\">Zero</li>";
            listLinneaBody += "</ul></div></li>";

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
            listLinneaBody += "\" variable=\"";
            listLinneaBody += `${variable}:0`;
            listLinneaBody += "\" onkeyup = 'writedim(this)'/>";
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
            listLinneaBody += "\" variable=\"";
            listLinneaBody += `${variable}:1`;
            listLinneaBody += "\" onkeyup = 'writedim(this)'/>";
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
            listLinneaBody += ADD_PROPERTY_LI_DIV_1;
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
            var ADD_CLMNVEC_LI_DIV_INP_UL_1 = "ADD_CLMNVEC_LI_DIV_INP_UL_1" + j;
            var ADD_CLMNVEC_LI_DIV_INP_LI_1 = "ADD_CLMNVEC_LI_DIV_INP_LI_1" + j;
            var ADD_CLMNVEC_LI_DIV_INP_LI_2 = "ADD_CLMNVEC_LI_DIV_INP_LI_2" + j;

            // for size IDS
            var V_TD_UL_LI_ID_2 = "V_TD_UL_LI_ID_2_J_" + j;
            var V_TD_UL_LI_DIV_ID_1 = "V_TD_UL_LI_DIV_ID_1_J_" + j;
            var V_TD_UL_LI_DIV_INP_ID_1 = "V_" + j + "_2";
            var V_TD_UL_LI_DIV_INP_ID_LB_1 = "V_TD_UL_LI_DIV_INP_ID_LB_1_J_" + j;

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
            var format_S = cached ? tblFormatsView.cache[variable].formats[1] : "100";
            var format_CR = cached ? tblFormatsView.cache[variable].formats[2] : "Column Vector";
            var var_format_CR = "";
            if (format_CR == "Column Vector"){
              var_format_CR = `${variable}:0`;
            }else{
              var_format_CR = `${variable}:1`;
            }
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
            listLinneaBody += "<input onchange='hideScalarDisplay(this," + V_TD_UL_LI_DIV_ID_1 + ", " + ADD_CLMNVEC_LI_DIV_1 + ", " + ADD_CLMNVEC_LI_DIV_INP_LI_1 + ", "+ ADD_CLMNVEC_LI_DIV_INP_LI_2 + ")' style=\"text-align: center; font-size: 11px; color: purple;\" class=\"format-input mdl-textfield__input ";
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

            // Column Vector or Row Vector
            listLinneaBody += "<li id=\"";
            listLinneaBody += ADD_CLMNVEC_LI_1;
            listLinneaBody += "\" class=\"ui-state-default\">";

            listLinneaBody += "<div id=\"";
            listLinneaBody += ADD_CLMNVEC_LI_DIV_1;
            listLinneaBody += "\" class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" variable =\"";
            listLinneaBody += variable;
            listLinneaBody += "\""
            //if(model.input.expression == "Bout=(k*inv(k-1))*Bin*(In+(-1*trans(A)*Wk*inv((k-1)*I1+trans(Wk)*A*Bin*trans(A)*Wk)*trans(Wk)*A*Bin))" && variable == "k"){
            
            listLinneaBody += ">";
            listLinneaBody += "<input onchange='changeVectorType(this, " + V_TD_UL_LI_DIV_INP_ID_1 + ")'";
            listLinneaBody += "\" style=\"font-size: 11px\" class=\"mdl-textfield__input ";
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
            listLinneaBody += "<li id=\""
            listLinneaBody += ADD_CLMNVEC_LI_DIV_INP_LI_1;
            listLinneaBody += "\" class=\"mdl-menu__item\" style=\"font-size: 11px\" data-val=\"";
            if(format_T == "Scalar"){
              listLinneaBody += "d\">Positive</li>";
            }else{
              listLinneaBody += "d\">Column Vector</li>";
              listLinneaBody += "<li id=\"";
              listLinneaBody += ADD_CLMNVEC_LI_DIV_INP_LI_2;
              listLinneaBody += "\" class=\"mdl-menu__item\" style=\"font-size: 11px\" data-val=\"";
              listLinneaBody += "d\">Row Vector</li>";
            }
            
            listLinneaBody += "</ul></div></li>";

            // Size of the Vector
            listLinneaBody += "<li id=\"";
            listLinneaBody += V_TD_UL_LI_ID_2;
            listLinneaBody += "\" class=\"ui-state-default\">";
            listLinneaBody += "<div id=\""
            listLinneaBody += V_TD_UL_LI_DIV_ID_1;
            
            listLinneaBody += "\" "; 
            if(format_T == "Scalar"){
              listLinneaBody += "style=\"display: none; \"";
            }else{
              listLinneaBody += "style=\"display: block; \"";
            }
            
            listLinneaBody += " class=\"mdl-textfield mdl-js-textfield ";
            listLinneaBody += "mdl-textfield--floating-label getmdl-select\" ";
            listLinneaBody += ">";
            listLinneaBody += "<input class=\"mdl-textfield__input ";
            listLinneaBody += "format-input\" id=\"";
            listLinneaBody += V_TD_UL_LI_DIV_INP_ID_1;
            listLinneaBody += "\" type=\"text\"  ";

            listLinneaBody += "value=\"";
            listLinneaBody += format_S;

            listLinneaBody += "\" style=\"font-size: 13px;\" data-val=\"";
            listLinneaBody += "\" variable=\"";
            listLinneaBody += var_format_CR;
            listLinneaBody += "\" onkeyup = 'writedim(this)'/>";
            listLinneaBody += "</label>";
            listLinneaBody += "<label id=\"";
            listLinneaBody += V_TD_UL_LI_DIV_INP_ID_LB_1;
            listLinneaBody += "\" class=\"mdl-textfield__label\" for=\"";
            listLinneaBody += V_TD_UL_LI_DIV_INP_ID_1;
            listLinneaBody += "\">Size: ";
            
            
            listLinneaBody += "</label>";
            listLinneaBody += "<ul class=\"mdl-menu ";
            listLinneaBody += "mdl-js-menu \" for=\"";
            listLinneaBody += "\">";
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
            inputArray.push(listId.charAt(0)+'_'+listId.charAt(2)+'_4');
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
      expr: "\\(b := (X^T X)^{-1} X^T y\\)",
      format: {
        b: { formats: ["Vector","1000","Column Vector"] },
        X: { formats: ["1500","1000","General","FullRank"] },
        y: { formats: ["Vector","1500","Column Vector"] },
      },
      code: "b=inv(trans(X)*X)*trans(X)*y",
    },
    input2:{
      name: "Generalized Least Squares",
      expr: "\\(b := (X^T M^{-1} X)^{-1} X^T M^{-1} y\\)",
      format: {
        X: {formats: ["2500","500","General","FullRank"]},
        M: {formats: ["2500","2500","General","SPD"]},
        b: {formats: ["Vector", "500", "Column Vector"]},
        y: {formats: ["Vector", "2500", "Column Vector"]},
      },
      code: "b=inv(trans(X)*inv(M)*X)*trans(X)*inv(M)*y",
    },
    input3:{
      name: "Triangular Matrix Inversion",
      expr: "\\(\\begin{aligned}X_{10} &:= L_{10} L_{00}^{-1} \\\\X_{20} &:= L_{20} + L_{22}^{-1} L_{21} L_{11}^{-1} L_{10} \\\\X_{11} &:= L_{11}^{-1} \\\\X_{21} &:= - L_{22}^{-1} L_{21}\\end{aligned}\\)",
      format: {
        X10: {formats: ["200","2000","General",""]},
        L10: {formats: ["200","2000","General","FullRank"]},
        L00: {formats: ["2000","2000","General","FullRank, LowerTriangular"]},
        X20: {formats: ["2000","2000","General",""]},
        L20: {formats: ["2000","2000","General","FullRank"]},
        L22: {formats: ["2000","2000","General","FullRank, LowerTriangular"]},
        L21: {formats: ["2000","200","General","FullRank"]},
        L11: {formats: ["200","200","General","FullRank, LowerTriangular"]},
        X11: {formats: ["200","200","General",""]},
        X21: {formats: ["2000","200","General",""]},
      },
      code: "X10=L10*inv(L00)\nX20=L20+(inv(L22)*L21*inv(L11)*L10)\nX11=inv(L11)\nX21=-inv(L22)*L21",
    },
    input4:{
      name: "Image Restoration",
      expr: "\\(\\begin{aligned}H^\\dagger &:= H^T ( H H^T )^{-1} \\\\y_k &:= H^\\dagger y + ( I_n - H^\\dagger H ) x_k\\end{aligned}\\)",
      format: {
        H_dag: {formats: ["5000", "1000", "General", "FullRank"]},
        H: {formats: ["1000", "5000", "General", "FullRank"]},
        y_k: {formats: ["Vector", "5000", "Column Vector"]},
        y: {formats: ["Vector", "1000", "Column Vector"]},
        I: {formats: ["5000", "5000", "General", ""]},
        x: {formats: ["Vector", "5000", "Column Vector"]},
      },
      code: "H_dag=trans(H)*inv(H*trans(H))\ny_k=H_dag*y+(I+(-H_dag*H))*x",
    },
    input5:{
      name: "Stochastic Newton",
      expr: "\\(\\begin{align} B_k :={}& \\frac{k}{k-1}B_{k-1} \\Bigl(I_n - A^T W_k \\bigl((k-1)I_l \\\\ &+ W_k^T A B_{k-1} A^T W_k \\bigr)^{-1} W_k^T A B_{k-1} \\Bigr) \\end{align}\\)",
      format: {
        Bout: {formats: ["1000", "1000", "General", "SPD"]},
        k: {formats: ["Scalar", "0", "Positive"]},
        Bin: {formats: ["1000", "1000", "General", "SPD"]},
        In: {formats: ["1000", "1000", "General", ""]},
        A: {formats: ["5000", "1000", "General", "FullRank"]},
        Wk: {formats: ["5000", "1", "General", "FullRank"]},
        I1: {formats: ["1", "1", "General", ""]},
      },
     code: "Bout=(k*inv(k-1))*Bin*(In+(-trans(A)*Wk*inv((k-1)*I1+trans(Wk)*A*Bin*trans(A)*Wk)*trans(Wk)*A*Bin))",
   },

  };

  var listExamplesBody = "";
  for (var e in examples) {
    if(examples[e].name == "Least Squares" ){
      listExamplesBody += "<li id=\"example_";
      listExamplesBody += e;
      listExamplesBody += "\" class=\"mdl-menu__item mdl-menu__item--full-bleed-divider\" style=\"font-size: 11px; \"><strong style=\"color:purple\" >";

      listExamplesBody += examples[e].name;
      listExamplesBody += ":</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ";
      listExamplesBody += examples[e].expr;
      listExamplesBody += "</li>";
    }else if(examples[e].name == "Generalized Least Squares"){
      listExamplesBody += "<li id=\"example_";
      listExamplesBody += e;
      listExamplesBody += "\" class=\"mdl-menu__item mdl-menu__item--full-bleed-divider\" style=\"font-size: 11px; \"><strong style=\"color:purple\" >";

      listExamplesBody += examples[e].name;
      listExamplesBody += ":</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ";
      listExamplesBody += examples[e].expr;
      listExamplesBody += "</li>";  
    }else if(examples[e].name == "Triangular Matrix Inversion"){
      listExamplesBody += "<li id=\"example_";
      listExamplesBody += e;
      listExamplesBody += "\" class=\"mdl-menu__item mdl-menu__item--full-bleed-divider\" style=\"font-size: 11px; height: 104px; padding-top: 16px;\"><strong style=\"color:purple\" >";

      listExamplesBody += examples[e].name;
      listExamplesBody += ":</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      listExamplesBody += examples[e].expr;
      listExamplesBody += "</li>";  
    }else if(examples[e].name == "Image Restoration"){
      listExamplesBody += "<li id=\"example_";
      listExamplesBody += e;
      listExamplesBody += "\" class=\"mdl-menu__item mdl-menu__item--full-bleed-divider\" style=\"font-size: 11px; height: 70px; padding-top: 10px;\"><strong style=\"color:purple\" >";

      listExamplesBody += examples[e].name;
      listExamplesBody += ":</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      listExamplesBody += examples[e].expr;
      listExamplesBody += "</li>";  
    }else if(examples[e].name == "Stochastic Newton"){
      listExamplesBody += "<li id=\"example_";
      listExamplesBody += e;
      listExamplesBody += "\" class=\"mdl-menu__item \" style=\"font-size: 11px; height: 70px; padding-top: 10px;\"><strong style=\"color:purple\" >";

      listExamplesBody += examples[e].name;
      listExamplesBody += ":</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
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
        //out("4");
        $("#txtExpr").css('height','64px');
        $("#txtExpr").val(code).trigger('inputchange');
        $("#txtExpr").html(code).trigger('inputchange');
        $("#lblError").css('visibility', 'hidden');
        model.setInput(code);
      };
      var setExample4 = function() {
        for (var f in format) {
          tblFormatsView.insertCacheEntry(f,format[f]);
        }
        //out("4");
        $("#txtExpr").css('height','64px');
        $("#txtExpr").val(code).trigger('inputchange');
        $("#txtExpr").html(code).trigger('inputchange');
        $("#lblError").css('visibility', 'hidden');
        model.setInput(code);
      };
      var setExample3 = function() {
        for (var f in format) {
          tblFormatsView.insertCacheEntry(f,format[f]);
        }
        //out("3");
        $("#txtExpr").css('height','128px');
        $("#txtExpr").val(code).trigger('inputchange');
        $("#txtExpr").html(code).trigger('inputchange');
        $("#lblError").css('visibility', 'hidden');
        model.setInput(code);
      };
      var setExample = function() {
        for (var f in format) {
          tblFormatsView.insertCacheEntry(f,format[f]);
        }
        //out("else");
        $("#txtExpr").css('height','32px');
        $("#txtExpr").val(code).trigger('inputchange');
        $("#txtExpr").html(code).trigger('inputchange');
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

  function changeVectorType (object, id){
    var var_tag = id.getAttribute("variable");
    var_tag = var_tag.charAt(0);
    console.log(id);
    if($(object).val() == 'Column Vector'){
      id.setAttribute("variable", `${var_tag}:0`);
    }else{
      id.setAttribute("variable", `${var_tag}:1`);
    }
  }

  function hideScalarDisplay(object, id, id2, id3, id4){
    var id2_id = id2.id;
    if($(object).val() == 'Vector'){
      id.style.display = 'block';
      var v = id2.getAttribute("variable");
      if(tblFormatsView.cache[`${v}`] !== undefined){
        if(tblFormatsView.cache[`${v}`].formats[2] !== undefined){
          if(tblFormatsView.cache[`${v}`].formats[2] == "Column Vector" || tblFormatsView.cache[`${v}`].formats[2] == "Row Vector"){
            id2.firstElementChild.value = tblFormatsView.cache[`${v}`].formats[2];
          }else{
            id2.firstElementChild.value = "Column Vector";
          }
          
        }

      }
      id3.textContent = "Column Vector";
      id4.style.display = 'block';
      id4.textContent = "Row Vector";
    }else if($(object).val() == 'Scalar'){
      id.style.display = 'none';
      var v = id2.getAttribute("variable");
      if(tblFormatsView.cache[`${v}`] !== undefined){
        out('yes');
        if(tblFormatsView.cache[`${v}`].formats[2] !== undefined){
          out('yesyes');
          if(tblFormatsView.cache[`${v}`].formats[2] == "Positive" || tblFormatsView.cache[`${v}`].formats[2] == "Negative"){
            id2.firstElementChild.value = tblFormatsView.cache[`${v}`].formats[2];
          }else{
            id2.firstElementChild.value = "Positive";
          }
          
        }

      }
      id3.textContent = "Positive";
      id4.style.display = 'none';
      id4.textContent = "Negative";
      
    }

  }

  function hidePropertyDisplay(object, id){
    if($(object).val() == 'General'){
      id.style.display = 'block';
      
      //out($("#"+id))
    }else if($(object).val() == 'Identity'){
      id.style.display = 'none';
      //$("#"+id).html('value');
    }else if($(object).val() == 'Zero'){
      id.style.display = 'none';
      //$("#"+id).html('value');
    }

  }

  var favorite = [];
  var inputInto = "";
  function addProperty(object, id){
    currentVariableId = id;
    modal.style.display = "block";
    var thisID = $(object).attr('id');
    //out($(object).val());
    inputInto = $(object).closest("div.content").find("input").attr('id');
    listofproperties = $('#'+inputInto).val().trim().split(',');
    //out(listofproperties);
    //out('this id is: ' + thisID);
    $('input:checkbox').removeAttr('checked');

    for(lst in listofproperties){
        //
        //out($('#'+listofproperties[lst].trim()));
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
    console.log("in generation");
    
    out(tblFormatsView.cache[model.input.juliaVars[0]]);
    if(tblFormatsView.cache !== undefined && model.input.juliaVars !== undefined && model.input.juliaVars.length != 0){
      var inputGenerated = "";
      inputGenerated += "\n";

      for(var v in model.input.juliaVars){
        var id_v = model.input.juliaVars[v];
        if (tblFormatsView.cache[`${id_v}`] !== undefined){  
          if (/^[a-z]/.test(id_v)){
            if(tblFormatsView.cache[`${id_v}`].formats[0] == "Scalar"){
              //inputGenerated += "Scalar " + id_v + " <" + tblFormatsView.cache[`${id_v}`].formats[2] + ">";
            }else{ 
              if(tblFormatsView.cache[`${id_v}`].formats[2] == "Row Vector"){
                inputGenerated += tblFormatsView.cache[`${id_v}`].ordering[1] + " = " + tblFormatsView.cache[`${id_v}`].formats[1];
              }else if(tblFormatsView.cache[`${id_v}`].formats[2] == "Column Vector"){
                inputGenerated += tblFormatsView.cache[`${id_v}`].ordering[1] + " = " + tblFormatsView.cache[`${id_v}`].formats[1];
              }
            }
            inputGenerated += "\n";
          }
        }
      }
      for(var v in model.input.juliaVars){
        var id_v = model.input.juliaVars[v];
        if (tblFormatsView.cache[`${id_v}`] !== undefined){
          if (/^[A-Z]/.test(id_v)){
            if(tblFormatsView.cache[`${id_v}`].formats[2] == "General"){
              inputGenerated += tblFormatsView.cache[`${id_v}`].ordering[0] + " = " + tblFormatsView.cache[`${id_v}`].formats[0];
              inputGenerated += "\n";
              inputGenerated += tblFormatsView.cache[`${id_v}`].ordering[1] + " = " + tblFormatsView.cache[`${id_v}`].formats[1];
              inputGenerated += "\n";
            }else if(tblFormatsView.cache[`${id_v}`].formats[2] == "Identity"){
              inputGenerated += tblFormatsView.cache[`${id_v}`].ordering[0] + " = " + tblFormatsView.cache[`${id_v}`].formats[0];
              inputGenerated += "\n";
              inputGenerated += tblFormatsView.cache[`${id_v}`].ordering[1] + " = " + tblFormatsView.cache[`${id_v}`].formats[1];
              inputGenerated += "\n";
            }else if(tblFormatsView.cache[`${id_v}`].formats[2] == "Zero"){
              inputGenerated += tblFormatsView.cache[`${id_v}`].ordering[0] + " = " + tblFormatsView.cache[`${id_v}`].formats[0];
              inputGenerated += "\n";
              inputGenerated += tblFormatsView.cache[`${id_v}`].ordering[1] + " = " + tblFormatsView.cache[`${id_v}`].formats[1];
              inputGenerated += "\n";
            }
          }
        }
      }


      
      for(var v in model.input.juliaVars){
        var id_v = model.input.juliaVars[v];
        if (tblFormatsView.cache[`${id_v}`] !== undefined){  
          if (/^[a-z]/.test(id_v)){
            if(tblFormatsView.cache[`${id_v}`].formats[0] == "Scalar"){
              inputGenerated += "Scalar " + id_v + " <" + tblFormatsView.cache[`${id_v}`].formats[2] + ">";
            }else{ 
              if(tblFormatsView.cache[`${id_v}`].formats[2] == "Row Vector"){
                inputGenerated += "RowVector " + id_v + "(" + tblFormatsView.cache[`${id_v}`].ordering[1] + ")" + "<>";
              }else if(tblFormatsView.cache[`${id_v}`].formats[2] == "Column Vector"){
                inputGenerated += "ColumnVector " + id_v + "(" + tblFormatsView.cache[`${id_v}`].ordering[1] + ")" + "<>";
              }
            }
            inputGenerated += "\n";
          }
        } 

      }
      for(var v in model.input.juliaVars){
        var id_v = model.input.juliaVars[v];
        
        if (tblFormatsView.cache[`${id_v}`] !== undefined){
          if (/^[A-Z]/.test(id_v)){
            if(tblFormatsView.cache[`${id_v}`].formats[2] == "General"){
              inputGenerated += "Matrix " + id_v + "(" + tblFormatsView.cache[`${id_v}`].ordering[0] + "," + tblFormatsView.cache[`${id_v}`].ordering[1] + ")" + "<" + tblFormatsView.cache[`${id_v}`].formats[3] + ">";
            }else if(tblFormatsView.cache[`${id_v}`].formats[2] == "Identity"){
              inputGenerated += "IdentityMatrix " + id_v + "(" + tblFormatsView.cache[`${id_v}`].ordering[0] + "," + tblFormatsView.cache[`${id_v}`].ordering[1] + ")" + "<>";
            }else if(tblFormatsView.cache[`${id_v}`].formats[2] == "Zero"){
              inputGenerated += "ZeroMatrix " + id_v + "(" + tblFormatsView.cache[`${id_v}`].ordering[0] + "," + tblFormatsView.cache[`${id_v}`].ordering[1] + ")" + "<>";
            }
            inputGenerated += "\n";
          }
        }
      }
      
      inputGenerated += model.input.expression;
      console.log(inputGenerated);
      $("#description").val(inputGenerated);
    }


  }

  function downloadOutput(){
    var blob = new Blob([$('#txtComputeLoops').val()],
              {type: "text/plain;charset=utf-8"});
    saveAs(blob, "Linnea_Algorithm.jl");
  }


// gulp merge javascript files
// LTT
//// scroll into view

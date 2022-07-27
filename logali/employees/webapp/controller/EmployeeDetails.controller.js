sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/employees/model/formatter"
], function (Controller, formatter) {

    function onInit() {

    };

    function onCreateIncidence() {

        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("Inc_Model");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index: index + 1 });
        incidenceModel.refresh();
        newIncidence.bindElement("Inc_Model>/" + index);
        tableIncidence.addContent(newIncidence);

    };

    var EmployeeDetails = Controller.extend("logaligroup.employees.controller.EmployeeDetails", {});

    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;

    return EmployeeDetails;
}); 
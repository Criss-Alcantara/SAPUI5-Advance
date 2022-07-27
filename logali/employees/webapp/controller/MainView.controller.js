sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {

    return Controller.extend("logaligroup.Employees.controller.MainView", {

        onInit: function () {

            var oJSONModel_Empl = new sap.ui.model.json.JSONModel();

            var oJSONModel_Count = new sap.ui.model.json.JSONModel();

            var oJSONModelLayout = new sap.ui.model.json.JSONModel();

            var oJSONModel_Config = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });

            var oView = this.getView();

            oJSONModel_Empl.loadData("../localService/mockdata/Employees.json", false);

            oJSONModel_Count.loadData("../localService/mockdata/Countries.json", false);

            oJSONModelLayout.loadData("../localService/mockdata/Layout.json", false);

            oView.setModel(oJSONModel_Empl, "Employees");

            oView.setModel(oJSONModel_Count, "Countries");

            oView.setModel(oJSONModel_Config, "Config");

            oView.setModel(oJSONModelLayout, "Layout");

            this._bus = sap.ui.getCore().getEventBus();
            
            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);

        },

        showEmployeeDetails: function (category, nameEvent, path) {

            var detailView = this.getView().byId("detailEmployeeView");

            var incidenceModel = new sap.ui.model.json.JSONModel([]);
            
            detailView.bindElement("Employees>" + path);

            detailView.setModel(incidenceModel, "Inc_Model");

            detailView.byId("tableIncidence").removeAllContent();
            
            this.getView().getModel("Layout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");
        }
    });
}); 
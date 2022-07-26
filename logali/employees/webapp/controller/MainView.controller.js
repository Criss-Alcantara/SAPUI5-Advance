sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        function onInit() {

            var oJSONModel_Empl = new sap.ui.model.json.JSONModel();

            var oJSONModel_Count = new sap.ui.model.json.JSONModel();

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

            oView.setModel(oJSONModel_Empl, "Employees");

            oView.setModel(oJSONModel_Count, "Countries");

            oView.setModel(oJSONModel_Config, "Config");

        };

        function onFilter() {

            var filters = [];

            var oList = this.getView().byId("tableEmployee");

            var oBinding = oList.getBinding("items");

            var oJSON_Countries = this.getView().getModel("Countries").getData();

            if (oJSON_Countries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON_Countries.EmployeeId));
            }

            if (oJSON_Countries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSON_Countries.CountryKey));
            }

            oBinding.filter(filters);
        };

        function onClearFilter() {

            var oModel = this.getView().getModel("Countries");

            var oList = this.getView().byId("tableEmployee");

            var oBinding = oList.getBinding("items");

            var filters = [];

            oModel.setProperty("/EmployeeId", "");

            oModel.setProperty("/CountryKey", "");

            oBinding.filter(filters);
        };

        function showPostalCode(oEvent) {

            var itemPressed = oEvent.getSource();

            var oContext = itemPressed.getBindingContext("Employees");

            var objectContext = oContext.getObject();

            sap.m.MessageToast.show(objectContext.PostalCode);

        }

        function onShowCity() {

            var oJSONModelConfig = this.getView().getModel("Config");

            oJSONModelConfig.setProperty("/visibleCity", true);

            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);

            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);

        };

        function onHideCity(){

            var oJSONModelConfig = this.getView().getModel("Config");

            oJSONModelConfig.setProperty("/visibleCity", false);

            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);

            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        };

        var Main = Controller.extend("logaligroup.employees.controller.MainView", {});

        Main.prototype.onValidate = function () {

            var inputEmployee = this.byId("inputEmployee");

            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                inputEmployee.setDescription("OK");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);
            } else {
                inputEmployee.setDescription("Not OK");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);
            }
        };

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;

        return Main;
    });

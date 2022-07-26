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

        function onHideCity() {

            var oJSONModelConfig = this.getView().getModel("Config");

            oJSONModelConfig.setProperty("/visibleCity", false);

            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);

            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        };

        function showOrders(oEvent) {

            var ordersTable = this.getView().byId("ordersTable");

            ordersTable.destroyItems();

            var itemPressed = oEvent.getSource();

            var oContext = itemPressed.getBindingContext("Employees");

            var objectContext = oContext.getObject();

            var orders = objectContext.Orders;

            var ordersItems = [];

            for (var i in orders) {
                ordersItems.push(new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Label({ text: orders[i].OrderID }),
                        new sap.m.Label({ text: orders[i].Freight }),
                        new sap.m.Label({ text: orders[i].ShipAddress })
                    ]
                }));
            }

            var newTable = new sap.m.Table({
                width: "auto",
                columns: [
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
                    new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) })
                ],
                items: ordersItems
            }).addStyleClass("sapUiSmallMargin");

            ordersTable.addItem(newTable);

            var newTableJSON = new sap.m.Table(); newTableJSON.setWidth("auto"); newTableJSON.addStyleClass("sapUiSmallMargin");
            
            var labelOrderID = new sap.m.Label(); labelOrderID.bindProperty("text", "i18n>orderID");

            var columnOrderID = new sap.m.Column(); columnOrderID.setHeader(labelOrderID); newTableJSON.addColumn(columnOrderID);

            var labelFreight = new sap.m.Label(); labelFreight.bindProperty("text", "i18n>freight");
            
            var columnFreight = new sap.m.Column(); columnFreight.setHeader(labelFreight); newTableJSON.addColumn(columnFreight);
            
            var labelShipAddress = new sap.m.Label(); labelShipAddress.bindProperty("text", "i18n>shipAddress");
            
            var columnShipAddress = new sap.m.Column(); columnShipAddress.setHeader(labelShipAddress); newTableJSON.addColumn(columnShipAddress);
            
            var cellOrderID = new sap.m.Label(); cellOrderID.bindProperty("text", "Employees>OrderID");

            var cellFreight = new sap.m.Label(); cellFreight.bindProperty("text", "Employees>Freight");
            
            var cellShipAddress = new sap.m.Label(); cellShipAddress.bindProperty("text", "Employees>ShipAddress");
            
            var columnListItem = new sap.m.ColumnListItem(); columnListItem.addCell(cellOrderID); columnListItem.addCell(cellFreight); columnListItem.addCell(cellShipAddress);
            
            var oBindingInfo = {
                model: "Employees",
                path: "Orders",
                template: columnListItem
            };

            newTableJSON.bindAggregation("items", oBindingInfo);
            
            newTableJSON.bindElement("Employees>" + oContext.getPath());

            ordersTable.addItem(newTableJSON);
        }

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
        Main.prototype.showOrders = showOrders;

        return Main;
    });

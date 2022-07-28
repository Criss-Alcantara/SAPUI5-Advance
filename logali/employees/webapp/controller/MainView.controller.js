sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {

    return Controller.extend("logaligroup.employees.controller.MainView", {

        onBeforeRendering: function () {
            this._detailEmployeeView = this.getView().byId("detailEmployeeView");
        },

        onInit: function () {

            var oView = this.getView();

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

            this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);

            this._bus.subscribe("incidence", "onDeleteIncidence", function(channelId, eventId, data) {
                
                 var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                 this.getView().getModel("Inc_Model").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                    "',SapId='" + data.SapId +
                    "',EmployeeId='" + data.EmployeeId + "')", {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(data.EmployeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                    }.bind(this)
                });

            }, this);

        },

        showEmployeeDetails: function (category, nameEvent, path) {

            var detailView = this.getView().byId("detailEmployeeView");

            var incidenceModel = new sap.ui.model.json.JSONModel([]);
            
            detailView.bindElement("odataNorthwind>" + path);

            detailView.setModel(incidenceModel, "Inc_Model");

            detailView.byId("tableIncidence").removeAllContent();
            
            this.getView().getModel("Layout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            this.onReadODataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
        }, 

        onSaveODataIncidence: function (channelId, eventId, data) {

            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            var incidenceModel = this._detailEmployeeView.getModel("Inc_Model").getData();

            if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {

                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].date,
                    Type: incidenceModel[data.incidenceRow].status,
                    Reason: incidenceModel[data.incidenceRow].Reason
                };

                this.getView().getModel("Inc_Model").create("/IncidentsSet", body, {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(employeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                    }.bind(this)
                })

            } else if (incidenceModel[data.incidenceRow].CreationDateX ||
                incidenceModel[data.incidenceRow].ReasonX ||
                incidenceModel[data.incidenceRow].TypeX) {

                var body = {
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                    Type: incidenceModel[data.incidenceRow].Type,
                    TypeX: incidenceModel[data.incidenceRow].TypeX,
                    Reason: incidenceModel[data.incidenceRow].Reason,
                    ReasonX: incidenceModel[data.incidenceRow].ReasonX
                };

                this.getView().getModel("Inc_Model").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                    "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                    "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId + "')", body, {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(employeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                    }.bind(this)
                });
            }

            else {
                sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
            };
        },
        onReadODataIncidence: function (employeeID) {

            this.getView().getModel("Inc_Model").read("/IncidentsSet", {
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                ],
                success: function (data) {
                    var incidenceModel = this._detailEmployeeView.getModel("Inc_Model");
                    incidenceModel.setData(data.results);
                    var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                    tableIncidence.removeAllContent();

                    for (var incidence in data.results) {
                        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence",
                            this._detailEmployeeView.getController());
                        this._detailEmployeeView.addDependent(newIncidence);
                        newIncidence.bindElement("Inc_Model>/" + incidence);
                        tableIncidence.addContent(newIncidence);
                    }
                }.bind(this),
                error: function (e) {
                }
            });
        }
    });
}); 
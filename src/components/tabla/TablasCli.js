/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Drawer, Input, Select, Tabs } from "antd";
import React, { useContext, useEffect } from "react";
import "./style.css";
import { GlobalContext } from "../context/GlobalContext";
import { CloseOutlined } from "@ant-design/icons";
import TablaInfo from "./TablaInfo";
import TablaProduc from "./TablaProduc";
import TablaRubros from "./TablaRubros";
import NuevoCliente from "../nuevoCliente/NuevoCliente";

const TablasCli = () => {
  const URLDOS = process.env.REACT_APP_URL;
  const PORT = window.location.port ? window.location.port : 80;
  const PROTOCOL = window.location.protocol;
  const HOSTNAME = window.location.hostname;
  const URL = `${PROTOCOL}//${HOSTNAME}:${PORT}`;

  const {
    searchValue,
    setSearchValue,
    selectedCliente,
    isDrawerVisible,
    setIsDrawerVisible,
    cliSelect,
    activeTab,
    setActiveTab,
    isDrawerVisibleForm,
    setIsDrawerVisibleForm,
    etiquetasSistema,
    setEtiquetasSistema,
    etiquetasSelec,
    setEtiquetasSelec,
  } = useContext(GlobalContext);

  const { Option } = Select;

  //const [etiquetasSelec, setEtiquetasSelec] = useState([]);

  const showDrawer = () => {
    setIsDrawerVisibleForm(true);
  };

  const closeIconStyle = {
    position: "absolute",
    top: "18px",
    right: "20px",
  };

  const CustomCloseIcon = ({ onClick }) => (
    <div style={closeIconStyle} onClick={onClick}>
      X
    </div>
  );

  const closeDrawer = () => {
    setIsDrawerVisibleForm(false);
  };

  localStorage.setItem("cliSelect", cliSelect);

  const handleCambio = (tabKey) => {
    setActiveTab(tabKey);
  };

  const items = [
    {
      key: "1",
      label: `INFORMATIVA`,
      children: <TablaInfo />,
    },
    {
      key: "2",
      label: `PRODUCTIVA COMERCIAL`,
      children: <TablaProduc />,
    },
    {
      key: "3",
      label: `PRODUCTIVA POR RUBRO`,
      children: <TablaRubros />,
    },
  ];

  useEffect(() => {
    fetch(`${URLDOS}etiquetaVistaCliente.php`, {
      method: "GET",
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setEtiquetasSistema(objetoData);
      });
    });
  }, []);

  return (
    <>
      <div className="div_wrapper">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h1 className="titulos">CLIENTES</h1>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Select
              mode="multiple"
              placeholder="Filtrar por etiquetas"
              style={{ width: "230px", marginRight: "12px" }}
              value={etiquetasSelec}
              onChange={setEtiquetasSelec}
            >
              {etiquetasSistema?.map((etiquet) => (
                <Option key={etiquet?.etq_id} value={etiquet?.etq_nombre}>
                  {etiquet?.etq_nombre.toUpperCase()}
                </Option>
              ))}
            </Select>

            <Input
              style={{ width: "200px", height: "33px" }}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Buscar por cliente o cuenta"
            />
            <Button
              type="primary"
              style={{
                width: "100px",
                padding: "0px",
                marginLeft: "10px",
                borderRadius: "0px",
              }}
              onClick={showDrawer}
            >
              Nuevo Lead
            </Button>
          </div>
        </div>

        <Drawer
          title="Nuevo Cliente"
          open={isDrawerVisibleForm}
          onClose={closeDrawer}
          width={420}
          closeIcon={<CustomCloseIcon />}
        >
          <NuevoCliente />
        </Drawer>
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          items={items}
          onChange={handleCambio}
        />
      </div>
      {selectedCliente && selectedCliente.cuenta !== "" && (
        <Drawer
          className="drawerCli"
          open={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          placement="bottom"
          height={"100%"}
          style={{ whiteSpace: "nowrap" }}
          closeIcon={
            <CloseOutlined
              style={{ position: "absolute", top: "8px", right: "8px" }}
            />
          }
        >
          <iframe
            loading="lazy"
            src={`${URLDOS}vista_cliente/?idC=${cliSelect}`}
            width={"100%"}
            style={{ border: "none", height: "calc(100% - 24px)" }}
            title="drawer"
          ></iframe>
        </Drawer>
      )}
    </>
  );
};

export default TablasCli;

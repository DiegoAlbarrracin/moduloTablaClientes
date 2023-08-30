/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-sequences */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { Spin, Table, Select, Modal, Button, notification } from "antd";
import "./style.css";
import { Option } from "antd/es/mentions";
import { AlertOutlined, ReloadOutlined } from "@ant-design/icons";
import BtnExcel from "./BtnExcel";

const TablaProduc = () => {
  const URLDOS = process.env.REACT_APP_URL;

  const {
    idUsu,
    infoClientes,
    setInfoclientes,
    searchValue,
    setSelectedCliente,
    setIsDrawerVisible,
    cliSelect,
    setCliSelect,
    setIsLoadingTR,
    isLoadingTP,
    setIsLoadingTP,
    setIsLoadingTI,
    activeTab,
    etiquetasSelec,
    actualizarData,
    setActualizarData,
  } = useContext(GlobalContext);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cliLead, setCliLead] = useState("");
  const [cliAct, setCliAct] = useState({});
  const [nombreGrupos, setNombreGrupos] = useState ();

  //const [isTotalRow, setIsTotalRow] = useState(false);

  const cargarTablaInfo = () => {
    setIsLoadingTP(true); // Establecer isLoadingTP en true antes de hacer la solicitud
    const data = new FormData();
    data.append("idU", idUsu);
    fetch(`${URLDOS}tablaProduct.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setInfoclientes(objetoData);
        setIsLoadingTP(false); // Establecer isLoadingTP en false después de recibir la respuesta
        setIsLoadingTI(true); // Establecer isLoadingTI en false el spin de tabla informacion
        setIsLoadingTR(true); // Establecer isLoadingTP en false el spin de tabla rubro
      });
    });
  };

  //Obtiene nombres de grupo1 y grupo2: http://10.0.0.153/duoc/modulos/getConf.php
  const getConf = async () => {
    const data = await fetch(`${URLDOS}getConf.php`);
    const jsonData = await data.json();
    setNombreGrupos(jsonData[0]);
  }

  //* PARA ORDENAR LOS VALORES EN LA TABLA, TENIENDO EN CUENTA LOS CARACTERES ESPECIALES Y LETRAS
  const convertToNumber = (value) => {
    const cleanedString = value
      .replace(/[^0-9.,S/D]+/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".");
    return cleanedString === "S/D"
      ? Number.MIN_SAFE_INTEGER
      : parseFloat(cleanedString);
  };

  const sorterWithTotalRow = (a, b, dataIndex) => {
    if (a === totalRow || b === totalRow) {
      return 0; // Si uno de los registros es totalRow, se mantiene en su posición original
    }
    const valueA = convertToNumber(a[dataIndex]);
    const valueB = convertToNumber(b[dataIndex]);
    return valueA - valueB;
  };

  useEffect(() => {
    if (activeTab === "2" && idUsu) {
      cargarTablaInfo();
      getConf();
    }
  }, [activeTab, idUsu, actualizarData]);

  // const rowClassName = (record, index) => {
  //   if (isTotalRow && index === 0) {
  //     return "total-row"; // Agrega una clase CSS para la fila totalRow
  //   }
  //   return "";
  // };

  const columnsProductivo = [
    {
      title: "CUENTA",
      dataIndex: "cuenta",
      key: "cuenta",
      align: "center",
      className: 'col-cuenta-ancho', //Puesto como style en .css porque de lo contrario afecta negativamente a la hora de exportar como archivo .xlsx, ya que pasa el width como parametro oculto a la hora de generar el xlxs y abrirlo (solo en Excel).
      sorter: (a, b) => parseInt(a.cuenta) - parseInt(b.cuenta), // Agregar esta propiedad para habilitar el ordenamiento
    },
    {
      title: "CLIENTE",
      dataIndex: "clientes",
      key: "clientes",
      align: "left",
      render: (text, record) => (
        <div
          style={{
            color: "#00b33c",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          {/* <Popover content={text}>{text}</Popover> */}
          {text}
        </div>
      ),
      className: 'col-cliente-ancho', //Puesto como style en .css porque de lo contrario afecta negativamente a la hora de exportar como archivo .xlsx, ya que pasa el width como parametro oculto a la hora de generar el xlxs y abrirlo (solo en Excel).      
      sorter: (a, b) => a.clientes?.localeCompare(b.clientes) || 0,
    },
    {
      title: "HAS. TOTALES",
      dataIndex: "hasTotales",
      key: "hasTotales",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "hasTotales"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "HAS. PROP.",
      dataIndex: "propias",
      key: "propias",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "propias"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "HAS. ALQ.",
      dataIndex: "alquiladas",
      key: "alquiladas",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "alquiladas"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "COMPRA USD INS.",
      dataIndex: "usdInsumo",
      key: "usdInsumo",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "usdInsumo"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "TT ENTREG.",
      dataIndex: "toneladasEntregadas",
      key: "toneladasEntregadas",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "toneladasEntregadas"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "COMPRA USD ESTIM.",
      dataIndex: "estimadoUSDInsumos",
      key: "estimadoUSD",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "estimadoUSDInsumos"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "TT ESTIM.",
      dataIndex: "estimadoToneladas",
      key: "estimadoToneladas",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "estimadoToneladas"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "NEG. USD ABIERTO",
      dataIndex: "negUSDAbierto",
      key: "negUSDAbierto",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "negUSDAbierto"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "TAREAS ABIERTAS",
      dataIndex: "tareasAbiertas",
      key: "tareasAbiertas",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "tareasAbiertas"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: `${nombreGrupos?.grupo1.toUpperCase()}`,
      dataIndex: "zonas",
      key: "zonas",
      className: "hidden-column"
    },
    {
      title: `${nombreGrupos?.grupo2.toUpperCase()}`,
      dataIndex: "centro",
      key: "centro",
      className: "hidden-column"
    },
  ];

  const handleCliente = (record) => {
    setSelectedCliente(record);
    setIsDrawerVisible(true);
    setCliSelect(parseInt(record.key));
  };

  const handleActualizarLead = () => {
    const data = new FormData();
    data.append("lead", Number(cliLead.cli_id));
    data.append("idCli", Number(cliAct));
    fetch(`${URLDOS}tablaClientes_actualizarLeadCliente.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        notification.open({
          message: "LEAD CONVERTIDO",
          description: "DATOS ACTUALIZADOS CORRECTAMENTE",
          duration: 3,
          placement: "bottomRight",
          icon: <AlertOutlined style={{ color: "#52c41a" }} />,
          style: {
            borderRadius: "4px",
            backgroundColor: "#f6ffed",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          },
        });
      });
    });

    setIsModalVisible(false);
    setActualizarData(!actualizarData);
  };

  localStorage.setItem("cliSelect", cliSelect);

  const filterData = (data) => {
    if (!infoClientes || searchValue === "") {
      return data;
    }
    return data.filter((item) => {
      return (
        item.clientes &&
        (item.clientes.toUpperCase().includes(searchValue.toUpperCase()) ||
          item.cuenta?.toString().includes(searchValue))
      );
    });
  };

  const filtrarClientes = () => {
    return infoClientes.filter((cliente) => {
      if (etiquetasSelec.length > 0) {
        const etiquetaCliente = cliente.etiqueta
          ? cliente.etiqueta.split(",")
          : [];
        const intersec = etiquetaCliente.filter((etq) =>
          etiquetasSelec.includes(etq)
        );

        if (intersec.length === 0) {
          return false;
        }
      }
      return true;
    });
  };

  const numberFormatOptions = {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  const dataProductivo = filterData(
    //infoClientes.map((c, index) => ({
    filtrarClientes().map((c, index) => ({
      key: c.cli_id,
      cuenta:
        c.cli_idsistema === "0" ? (
          <>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                className="selected_tag"
                style={{ background: "#56b43c", display: "inline-block" }}
              >
                <span className="etq_name">{"LEAD".toUpperCase()}</span>
              </div>
              <ReloadOutlined
                style={{
                  color: "#56b43c",
                  fontSize: "small",
                  padding: "0px",
                  marginLeft: "5px",
                }}
                onClick={() => (setIsModalVisible(true), setCliLead(c))}
              />
            </div>
          </>
        ) : (
          c.cli_idsistema
        ),
      clientes: c.cli_nombre,
      propias: c.has_propias
        ? typeof c.has_propias === "string"
          ? parseInt(c.has_propias)
            .toLocaleString(undefined, numberFormatOptions)
            .replace(/,/g, ".")
          : c.has_propias
        : "S/D",
      alquiladas: c.has_alquiladas
        ? typeof c.has_alquiladas === "string"
          ? parseInt(c.has_alquiladas)
            .toLocaleString(undefined, numberFormatOptions)
            .replace(/,/g, ".")
          : c.has_alquiladas
        : "S/D",
      hasTotales: c.has_totales
        ? typeof c.has_totales === "string"
          ? parseInt(c.has_totales)
            .toLocaleString(undefined, numberFormatOptions)
            .replace(/,/g, ".")
          : c.has_totales
        : "S/D",
      usdInsumo: c.usdEntregados
        ? typeof c.usdEntregados === "string"
          ? parseInt(c.usdEntregados)
            .toLocaleString(undefined, numberFormatOptions)
            .replace(/,/g, ".")
          : c.usdEntregados
        : "S/D",
      estimadoUSDInsumos: c.costoEstimado
        ? typeof c.costoEstimado === "string"
          ? parseInt(c.costoEstimado)
            .toLocaleString(undefined, numberFormatOptions)
            .replace(/,/g, ".")
          : c.costoEstimado
        : "S/D",
      toneladasEntregadas: c.toneladasEntregadas
        ? typeof c.toneladasEntregadas === "string"
          ? parseInt(c.toneladasEntregadas)
            .toLocaleString(undefined, numberFormatOptions)
            .replace(/,/g, ".")
          : c.toneladasEntregadas
        : "S/D",
      estimadoToneladas: c.toneladasEstimadas
        ? typeof c.toneladasEstimadas === "string"
          ? parseInt(c.toneladasEstimadas)
            .toLocaleString(undefined, numberFormatOptions)
            .replace(/,/g, ".")
          : c.toneladasEstimadas
        : "S/D",
      negUSDAbierto: c.suma_neg_valor
        ? typeof c.suma_neg_valor === "string"
          ? parseInt(c.suma_neg_valor)
            .toLocaleString(undefined, numberFormatOptions)
            .replace(/,/g, ".")
          : c.suma_neg_valor
        : "S/D",
      tareasAbiertas: c.cantidad_tareas_pendientes
        ? typeof c.cantidad_tareas_pendientes === "string"
          ? parseInt(c.cantidad_tareas_pendientes).toFixed(0)
          : c.cantidad_tareas_pendientes
        : "S/D",

      zonas: c.gruuno_desc,
      centro: c.grudos_desc,
    }))
  );

  const sumColumns = (dataProductivo, columnIndex) => {
    let sum = 0;
    for (let i = 0; i < dataProductivo.length; i++) {
      const value = parseInt(
        dataProductivo[i][columnIndex].replace(/\./g, "").replace(/,/g, "."),
        10
      );
      if (!isNaN(value)) {
        sum += value;
      }
    }
    return sum
      .toLocaleString(undefined, {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/,/g, ".");
  };

  const totalRow = {
    cuenta: "",
    clientes: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>TOTALES</span>
    ),
    propias: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataProductivo, "propias")}
      </span>
    ),
    alquiladas: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataProductivo, "alquiladas")}
      </span>
    ),
    hasTotales: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataProductivo, "hasTotales")}
      </span>
    ),
    usdInsumo: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataProductivo, "usdInsumo")}
      </span>
    ),
    toneladasEntregadas: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataProductivo, "toneladasEntregadas")}
      </span>
    ),
    estimadoUSDInsumos: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataProductivo, "estimadoUSDInsumos")}
      </span>
    ),
    estimadoToneladas: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataProductivo, "estimadoToneladas")}
      </span>
    ),
    negUSDAbierto: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataProductivo, "negUSDAbierto")}
      </span>
    ),
    tareasAbiertas: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataProductivo, "tareasAbiertas")}
      </span>
    ),
  };

  const clientesOptions = infoClientes
    ? infoClientes
      .filter((cliente) => cliente.cli_idsistema != 0)
      .map((cliente) => (
        <Option key={cliente.cli_id} value={cliente.cli_id}>
          {cliente.cli_nombre}
        </Option>
      ))
    : null;

  return (
    <>
      <BtnExcel columns={columnsProductivo} dataSource={dataProductivo} saveAsName={'tablaProdComercial'} />

      {isLoadingTP ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={dataProductivo}
          columns={columnsProductivo}
          size="small"
          pagination={{showSizeChanger: false}}
          onRow={(record) => ({
            onClick: (event) => {
              if (event.target.tagName !== "DIV") {
                // Verificar si el clic no se hizo en el elemento <span> del nombre del cliente
                return;
              }
              handleCliente(record);
            },
          })}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: "#f5fef5" }}>
                <Table.Summary.Cell index={0} />
                <Table.Summary.Cell index={1}>
                  {totalRow.clientes}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} className="totalCell">
                  {totalRow.hasTotales}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} className="totalCell">
                  {totalRow.propias}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} className="totalCell">
                  {totalRow.alquiladas}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} className="totalCell">
                  {totalRow.usdInsumo}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} className="totalCell">
                  {totalRow.toneladasEntregadas}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} className="totalCell">
                  {totalRow.estimadoUSDInsumos}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} className="totalCell">
                  {totalRow.estimadoToneladas}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9} className="totalCell">
                  {totalRow.negUSDAbierto}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10} className="totalCell">
                  {totalRow.tareasAbiertas}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      )}
      {isModalVisible ? (
        <Modal
          title="CONVERTIR LEAD A CLIENTE"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => handleActualizarLead()}
            >
              Actualizar
            </Button>,
          ]}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "15px",
              marginBottom: "20px",
            }}
          >
            <div
              className="selected_tag"
              style={{ background: "#56b43c", display: "inline-block" }}
            >
              <span className="etq_name" style={{ fontWeight: "bold" }}>
                LEAD
              </span>
            </div>

            <span style={{ marginLeft: "5px" }}>{cliLead.cli_nombre}</span>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                marginBottom: "5px",
              }}
            >
              Seleccione Cliente:
            </label>
            <Select
              style={{ minWidth: "250px" }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option &&
                option.children &&
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(option) => setCliAct(option)}
            >
              {clientesOptions}
            </Select>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default TablaProduc;

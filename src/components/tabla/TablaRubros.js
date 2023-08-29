/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-sequences */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Modal, Select, Spin, Table, notification } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "./style.css";
import { AlertOutlined, ReloadOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import BtnExcel from "./BtnExcel";

const TablaRubros = () => {
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
    isLoadingTR,
    setIsLoadingTR,
    setIsLoadingTP,
    setIsLoadingTI,
    activeTab,
    etiquetasSelec,
    actualizarData,
    setActualizarData,
  } = useContext(GlobalContext);

  //const [isTotalRow, setIsTotalRow] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cliLead, setCliLead] = useState("");
  const [cliAct, setCliAct] = useState({});
  const [nombreGrupos, setNombreGrupos] = useState ();


  const cargarTablaInfo = () => {
    setIsLoadingTR(true); // Establecer isLoadingTR en true antes de hacer la solicitud
    const data = new FormData();
    data.append("idU", idUsu);
    fetch(`${URLDOS}tablaRubro.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setInfoclientes(objetoData);
        setIsLoadingTR(false); // Establecer isLoadingTR en false después de recibir la respuesta
        setIsLoadingTI(true); // Establecer isLoadingTI en false el spin de tabla informacion
        setIsLoadingTP(true); // Establecer isLoadingTP en false el spin de tabla productivo
      });
    });
  };

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
    if (activeTab === "3" && idUsu) {
      cargarTablaInfo();
      getConf();
    }
  }, [activeTab, idUsu, actualizarData]);

    //Obtiene nombres de grupo1 y grupo2: http://10.0.0.153/duoc/modulos/getConf.php
    const getConf = async () => {
      const data = await fetch(`${URLDOS}getConf.php`);
      const jsonData = await data.json();
      setNombreGrupos(jsonData[0]);
  
    }

  const columnsRubros = [
    {
      title: "CUENTA",
      dataIndex: "cuenta",
      key: "cuenta",
      align: "center",
      width: "50px",
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
            maxWidth: "250px", // Ajusta el valor según el ancho deseado
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          {text}
        </div>
      ),
      width: "300px",
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
      title: "AGRICULTURA",
      dataIndex: "agricultura",
      key: "agricultura",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "agricultura"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "GANADERIA",
      dataIndex: "ganaderia",
      key: "ganaderia",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "ganaderia"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "TAMBO",
      dataIndex: "tambo",
      key: "tambo",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "tambo"),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "MIXTO",
      dataIndex: "mixto",
      key: "mixto",
      align: "right",
      sorter: (a, b) => sorterWithTotalRow(a, b, "mixto"),
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

  const dataRubros = filterData(
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
      hasTotales: c.has_totales
        ? typeof c.has_totales === "string"
          ? parseInt(c.has_totales)
              .toLocaleString(undefined, numberFormatOptions)
              .replace(/,/g, ".")
          : c.has_totales
        : "S/D",
      agricultura: c.Agricultura
        ? typeof c.Agricultura === "string"
          ? parseInt(c.Agricultura)
              .toLocaleString(undefined, numberFormatOptions)
              .replace(/,/g, ".")
          : c.Agricultura
        : "S/D",
      ganaderia: c.Ganaderia
        ? typeof c.Ganaderia === "string"
          ? parseInt(c.Ganaderia)
              .toLocaleString(undefined, numberFormatOptions)
              .replace(/,/g, ".")
          : c.Ganaderia
        : "S/D",
      tambo: c.Tambo
        ? typeof c.Tambo === "string"
          ? parseInt(c.Tambo)
              .toLocaleString(undefined, numberFormatOptions)
              .replace(/,/g, ".")
          : c.Tambo
        : "S/D",
      mixto: c.Mixto
        ? typeof c.Mixto === "string"
          ? parseInt(c.Mixto)
              .toLocaleString(undefined, numberFormatOptions)
              .replace(/,/g, ".")
          : c.Mixto
        : "S/D",

        zonas: c.gruuno_desc,
        centro: c.grudos_desc,
    }))
  );

  const sumColumns = (dataRubros, columnIndex) => {
    let sum = 0;
    for (let i = 0; i < dataRubros.length; i++) {
      const value = parseInt(
        dataRubros[i][columnIndex].replace(/\./g, "").replace(/,/g, "."),
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
    hasTotales: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataRubros, "hasTotales")}
      </span>
    ),
    agricultura: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataRubros, "agricultura")}
      </span>
    ),
    ganaderia: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataRubros, "ganaderia")}
      </span>
    ),
    tambo: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataRubros, "tambo")}
      </span>
    ),
    mixto: (
      <span style={{ color: "#00b33c", fontWeight: "bold" }}>
        {sumColumns(dataRubros, "mixto")}
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
      <BtnExcel columns={columnsRubros} dataSource={dataRubros} saveAsName={'tablaProdRubro'} />

      {isLoadingTR ? (
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
          dataSource={dataRubros}
          columns={columnsRubros}
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
                  {totalRow.agricultura}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} className="totalCell">
                  {totalRow.ganaderia}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} className="totalCell">
                  {totalRow.tambo}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} className="totalCell">
                  {totalRow.mixto}
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

export default TablaRubros;

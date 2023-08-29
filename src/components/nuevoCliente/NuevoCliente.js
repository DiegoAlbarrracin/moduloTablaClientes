/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Divider, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useContext, useEffect, useState, useRef } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "./style.css";

const NuevoCliente = () => {
  const URLDOS = process.env.REACT_APP_URL;

  const formRef = useRef(null);

  const { idUsu, setIsDrawerVisibleForm, actualizarData, setActualizarData } =
    useContext(GlobalContext);

  const initialValues = {
    razonSocial: "",
    descripcion: "",
    telefono: "",
    celular: "",
    cuit: "",
    email: "",
    sector: undefined,
    tipoClientes: undefined,
    tamano: undefined,
    zona: undefined,
    centro: undefined,
  };

  const [sector, setSector] = useState(null);
  const [tamaño, setTamaño] = useState(null);
  const [tiposCliente, setTiposClientes] = useState(null);
  const [grupoUno, setGrupoUno] = useState(null);
  const [grupoDos, setGrupoDos] = useState(null);

  const [conf, setConf] = useState();

  const cargarSector = () => {
    const data = new FormData();
    data.append("idU", idUsu);
    fetch(`${URLDOS}sectorCli.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setSector(objetoData);
      });
    });
  };

  const cargarTamaño = () => {
    const data = new FormData();
    data.append("idU", idUsu);
    fetch(`${URLDOS}tamanoCli.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setTamaño(objetoData);
      });
    });
  };

  const cargarTipClientes = () => {
    const data = new FormData();
    data.append("idU", idUsu);
    fetch(`${URLDOS}tiposCli.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setTiposClientes(objetoData);
      });
    });
  };

  const cargarGruUno = () => {
    const data = new FormData();
    data.append("idU", idUsu);
    fetch(`${URLDOS}gruUnoCli.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setGrupoUno(objetoData);
      });
    });
  };

  const cargarGruDos = () => {
    const data = new FormData();
    data.append("idU", idUsu);
    fetch(`${URLDOS}gruDosCli.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setGrupoDos(objetoData);
      });
    });
  };

  useEffect(() => {
    cargarSector();

    cargarTamaño();

    cargarTipClientes();

    cargarGruUno();

    cargarGruDos();
  }, []);

  //* FUNCION QUE CARGA LOS DATOS DE UN NUEVO CLIENTE
  function nuevoCli(values) {
    const data = new FormData();
    data.append("idUsu", idUsu);
    data.append("razonSocial", values.razonSocial);
    data.append("descripcion", values.descripcion);
    data.append("telefono", values.telefono);
    data.append("celular", values.celular);
    data.append("cuit", values.cuit);
    data.append("email", values.email);
    data.append("sector", values.sector);
    data.append("tipoClientes", values.tipoClientes);
    data.append("tamano", values.tamano);
    data.append("zona", values.zona);
    data.append("centro", values.centro);
    fetch(`${URLDOS}nuevoCliente.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
      });
    });

    // Limpiar el formulario
    formRef.current.setFieldsValue(initialValues);

    setIsDrawerVisibleForm(false);
    setActualizarData(!actualizarData);
  }

  useEffect(() => {
    const url = `${URLDOS}getConf.php`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setConf(data);
      });
  }, []);

  return (
    <>
      <Form
        ref={formRef}
        initialValues={initialValues}
        labelCol={{ span: 10 }}
        layout="vertical"
        onFinish={nuevoCli}
      >
        <div>
          <div>
            <Form.Item
              label="Razón Social"
              name="razonSocial"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa la razón social",
                },
              ]}
              className="hidden-asterisk"
            >
              <Input />
            </Form.Item>

            <Form.Item label="Descripción" name="descripcion">
              <TextArea />
            </Form.Item>
          </div>

          <div className="inline-inputs-contenedor">
            <Form.Item label="Teléfono" name="telefono">
              <Input className="input-width" />
            </Form.Item>
            <Form.Item
              label="Celular"
              name="celular"
              className="hidden-asterisk"
            >
              <Input className="input-width" />
            </Form.Item>
          </div>

          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <div className="inline-inputs-contenedor" >
            <Form.Item label="CUIT" name="cuit" className="hidden-asterisk">
              <Input className="input-width" />
            </Form.Item>

            <Form.Item label="Tamaño" name="tamano" className="hidden-asterisk input-width">
              {tamaño ? (
                <Select >
                  {tamaño.map((tam) => (
                    <Select.Option key={tam.tam_id} value={tam.tam_id}>
                      {tam.tam_desc}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <Select.Option value="CARGANDO">
                  CARGANDO OPCIONES...
                </Select.Option>
              )}
            </Form.Item>
          </div>

          <div className="inline-inputs-contenedor">
            <Form.Item
              label="Tipo Cliente"
              labelCol={{ span: 20 }}
              name="tipoClientes"
              className="hidden-asterisk input-width"
            >
              {tiposCliente ? (
                <Select>
                  {tiposCliente.map((tip) => (
                    <Select.Option key={tip.tip_id} value={tip.tip_id}>
                      {tip.tip_desc}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <Select.Option value="CARGANDO">
                  CARGANDO OPCIONES...
                </Select.Option>
              )}
            </Form.Item>
            <Form.Item
              label="Sector"
              name="sector"
              className="hidden-asterisk input-width"
            >
              {sector ? (
                <Select>
                  {sector.map((sec) => (
                    <Select.Option key={sec.sec_id} value={sec.sec_id}>
                      {sec.sec_desc}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <Select.Option value="CARGANDO">
                  CARGANDO OPCIONES...
                </Select.Option>
              )}
            </Form.Item>
          </div>

          <div className="inline-inputs-contenedor">
            <Form.Item
              label={conf ? conf[0].grupo1 : "-"}
              name="zona"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione la zona",
                },
              ]}
              className="hidden-asterisk input-width"
            >
              {grupoUno ? (
                <Select>
                  {grupoUno.map((uno) => (
                    <Select.Option key={uno.gruuno_id} value={uno.gruuno_id}>
                      {uno.gruuno_desc}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <Select.Option value="CARGANDO">
                  CARGANDO OPCIONES...
                </Select.Option>
              )}
            </Form.Item>
            <Form.Item
              label={conf ? conf[0].grupo2 : "-"}
              name="centro"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione el centro",
                },
              ]}
              className="hidden-asterisk input-width"
            >
              {grupoDos ? (
                <Select >
                  {grupoDos.map((dos) => (
                    <Select.Option key={dos.grudos_id} value={dos.grudos_id}>
                      {dos.grudos_desc}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <Select.Option value="CARGANDO">
                  CARGANDO OPCIONES...
                </Select.Option>
              )}
            </Form.Item>
          </div>
        </div>
        <div >
          <Button type="primary" htmlType="submit" className="btn-guardar">
            GUARDAR NUEVO LEAD
          </Button>
        </div>
      </Form>
    </>
  );
};

export default NuevoCliente;

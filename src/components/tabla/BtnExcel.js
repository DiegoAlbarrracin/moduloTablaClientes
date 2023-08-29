import React from 'react'
import "./style.css";
import { Button } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";
import moment from 'moment';

function BtnExcel({columns, dataSource, saveAsName}) {

    const handleClick = () => {

        for (const cliente of dataSource) {
            if(!Number.isInteger(parseInt(cliente.cuenta))){
                cliente.cuenta = "LEAD";
            }
        }
        
        const excel = new Excel();
        excel
          .addSheet("Hoja 1")
          .addColumns(columns) //parametro
          .addDataSource(dataSource, { //parametro
            str2Percent: true
          })
          .saveAs(`${saveAsName}_${moment(new Date()).format("DDMMYYYY")}.xlsx`); //parametro
    };


  return (
    <div className='btn-export-contenedor'>
        <Button className='btn-export' onClick={handleClick} type='primary' icon={<FileExcelOutlined />} >Exportar</Button>
    </div>
  )
}

export default BtnExcel
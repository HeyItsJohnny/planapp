import React from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Search,
  Inject,
  Edit,
  Sort,
  Filter,
  Toolbar
} from "@syncfusion/ej2-react-grids";

//DATA
import { customersData, contextMenuItems, customersGrid } from "../data/dummy";

import { Header } from "../components";

const SharedLogins = () => {
  return (
    <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category="Settings" title="Shared Logins" />
      <GridComponent
        dataSource={customersData}
        allowPaging
        allowSorting
        toolbar={['Delete','Search']}
        editSettings={{ allowDeleting: true, allowEditing: true}}
        width="auto"
      >
        <ColumnsDirective>
          {customersGrid.map((item,index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services= {[Page, Search, Toolbar, Selection, Edit, Sort, Filter]}/>
      </GridComponent>
    </div>
  );
};

export default SharedLogins;

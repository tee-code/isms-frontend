import React from 'react'
import { Switch,Route } from "react-router"
import App from "./App.js"
import Home from './Components/Home/Home.js'
import Login from './Components/Login/Login.js'
import Credit from './Components/Credit/Credit.js'
import Debit from './Components/Debit/Debit.js'
import Info from './Components/Info/Info.js'
import AddDriver from './Components/AddDriver/AddDriver.js'
import AddCustomer from './Components/AddCustomer/AddCustomer.js'
import AddProduct from './Components/AddProduct/AddProduct.js'
import AddStaff from './Components/AddStaff/AddStaff.js'
import AddVehicle from './Components/AddVehicle/AddVehicle.js'
import AddVendor from './Components/AddVendor/AddVendor.js'
import AddQuantity from './Components/AddQuantity/AddQuantity.js'
import ManageAdmin from './Components/ManageAdmin/ManageAdmin.js'
import ManageCompany from './Components/ManageCompany/ManageCompany.js'
import ManageCustomer from './Components/ManageCustomer/ManageCustomer.js'
import ManageDriver from './Components/ManageDriver/ManageDriver.js'
import ManageMapping from './Components/ManageMapping/ManageMapping.js'
import ManageProduct from './Components/ManageProduct/ManageProduct.js'
import ManageQuantity from './Components/ManageQuantity/ManageQuantity.js'
import ManageStaff from './Components/ManageStaff/ManageStaff.js'
import ManageVehicle from './Components/ManageVehicle/ManageVehicle.js'
import ManageVendor from './Components/ManageVendor/ManageVendor.js'
import Sales from './Components/Sales/Sales.js'
import SalesReport from './Components/SalesReport/SalesReport.js'
import Settings from './Components/Settings/Settings.js'
import Mapping from './Components/Mapping/Mapping.js'
import Supply from './Components/Supply/Supply.js'
import SupplyReport from './Components/SupplyReport/SupplyReport.js'
import PaymentReport from './Components/PaymentReport/PaymentReport.js'


const Main = () => (

  <Switch>
    <Route exact path = "/" component = { Home }/> 
    <Route exact path = "/login" component = { Login }/> 
    <Route exact path = "/admins" component = { ManageAdmin }/> 
    <Route exact path = "/company" component = { ManageCompany }/> 
    <Route exact path = "/drivers" component = { ManageDriver } /> 
    <Route exact path = '/customers' component = { ManageCustomer }/> 
    <Route exact path = '/staffs' component = { ManageStaff }/> 
    <Route exact path = '/vehicles' component = { ManageVehicle }/> 
    <Route exact path = '/vendors' component = { ManageVendor }/> 
    <Route exact path = '/products' component =  { ManageProduct } />
    <Route exact path = '/quantity' component =  { ManageQuantity } />
    <Route exact path = '/mappings' component =  { ManageMapping } />
    <Route exact path = '/add-driver' component =  { AddDriver } />
    <Route exact path = '/add-customer' component =  { AddCustomer } />
    <Route exact path = '/add-product' component =  { AddProduct } />
    <Route exact path = '/add-quantity' component =  { AddQuantity } />
    <Route exact path = '/add-staff' component =  { AddStaff } />
    <Route exact path = '/add-vehicle' component =  { AddVehicle } />
    <Route exact path = '/add-vendor' component =  { AddVendor } />
    <Route exact path = '/credit' component =  { Credit } />
    <Route exact path = '/debit' component =  { Debit } />
    <Route exact path = '/info' component =  { Info } />
    <Route exact path = '/mapping' component =  { Mapping } />
    <Route exact path = '/payment-report' component =  { PaymentReport } />
    <Route exact path = '/supply-report' component =  { SupplyReport } />
    <Route exact path = '/sales-report' component =  { SalesReport } />
    <Route exact path = '/sales' component =  { Sales } />
    <Route exact path = '/supply' component =  { Supply } />
    <Route exact path = '/settings' component =  { Settings } />
  </Switch>

)

export default Main

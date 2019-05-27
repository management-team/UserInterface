import * as React from 'react';
import { Table, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { ICognitoUser } from '../../../model/cognito-user.model';
import ViewUserModal from '../view-user-modal/view-user-modal.container';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { Link } from 'react-router-dom';

export interface IManageInternalComponentProps {
  updateManageUsersTable: (group: string) => void,
  manageUsers: ICognitoUser[];

  
  toggleViewUserModal: () => void;
  /**
   * Handles what happens when a user is hovered
   * 
   * @param email: The email address of the hovered user
   */
  hoveredUser: (email: string) => void;
}
/**
 * {v}: dropdown with further info
 * #: hoverable props
 * [... ]: button
 * 
 * `Row headers:
 * |-----------\|---------------------\|-------------\|----------\
 * |--'Admins'--|--'Staging Managers'--|--'Trainers'--|--Cohorts--|                              [*+ ]
 * [ *********************************************************************************************** ]
 * [--Cohort.Name--|--Address.alias{v}--|--Token.(){v}-- |--StartMonth--|--trainer email-v--         ]
 * [=================================================================================================|
 * [  1901-blake   |  USF               | [Get token  v] | March 2019   | [blake.kruppa@gmail.com v] |
 * [-------------------------------------------------------------------------------------------------|
 * [  1902-flake   |  Reston            | [Get token  v] | March 2019   | [flake@gmail.com v       ] |
 * [-------------------------------------------------------------------------------------------------|
 * [  1903-fake    |  USF               | [Get token  v] | March 2019   | [abatson@gmail.com v     ] |
 * [-------------------------------------------------------------------------------------------------|
 * [  1904-bake    |  Reston            | [Get token  v] | March 2019   | [fllorida.man@gmail.com v] |
 * [-------------------------------------------------------------------------------------------------|
 * [  1905-make    |  USF               | [Get token  v] | March 2019   | [blake.kruppa@gmail.com v] |
 * [ *********************************************************************************************** |
 *                                                                         [p1 ] [p2 ] ... [p4 ] [p5 ]                
 * `
 * {
 *   Cohort # {
 *     cohortDescription,
 *   }
 * 
 * }
 */

export class ManageInternalComponenet extends React.Component<IManageInternalComponentProps, any> {

  constructor(props: IManageInternalComponentProps) {
    super(props);
    this.state={
      roleDropdownList: false,
      dropDownValue: "all"
    }
  }

  displayUserModal = (userEmail: string) => {
    this.props.toggleViewUserModal();
    // this.props.selectUserForDisplay(userEmail);
  }

  toggleDropdownList =() =>{
    this.setState({
      roleDropdownList: !this.state.roleDropdownList
    });
  }
  updateDropdown =(option: string) => {
    this.props.updateManageUsersTable(option)
    this.setState({dropDownValue: option})
  } 

  // returns active if the role provided in the route is the routeName provided
  isActive = (routeName: string) => ((this.state.selectedRole === routeName) ? 'manage-user-nav-item-active' : 'manage-user-nav-item')

  render() {
    let path = '/management'
    return (
      <>
        <div id="manage-cohorts-nav" className="rev-background-color">
          <div id="manage-cohorts-view-selection-container">
            <div>View By Role:</div>
            <Dropdown color="success" className="responsive-modal-row-item rev-btn"
              isOpen={this.state.roleDropdownList} toggle={this.toggleDropdownList}>
              {/* toggle={this.props.toggleViewUserModal}> */}
              <DropdownToggle caret>
              {this.state.dropDownValue}
                </DropdownToggle>
              <DropdownMenu>
                <DropdownItem >
                  <Link to= {path +"/manage/all"}
              className={`nav-link ${this.isActive('all')}`}
              onClick={() => this.updateDropdown('all') }>All</Link></DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <Link to= {path +"/manage/admin"}
              className={`nav-link ${this.isActive('admin')}`}
              onClick={() => this.updateDropdown('admin')}>Admin</Link></DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <Link to= {path +"/manage/trainer"}
              className={`nav-link ${this.isActive('trainer')}`}
              onClick={() => this.updateDropdown('trainer')}>Trainer</Link></DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <Link to= {path +"/manage/staging-manager"}
              className={`nav-link ${this.isActive('staging-manager')}`}
              onClick={() => this.updateDropdown('staging-manager')}>Staging Manager</Link></DropdownItem>
                <DropdownItem divider />
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* <div>
            <Button className="responsive-modal-row-item rev-btn" onClick={this.props.toggleCreateCohortModal}>New Cohort</Button>
          </div> */}
        </div>
        <Table striped id="manage-users-table">
          <ViewUserModal />
          <thead className="rev-background-color">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.manageUsers.map((user) =>
                <tr key={user.email} className="rev-table-row" onClick={this.props.toggleViewUserModal}>
                  <td></td>
                  <td></td>
                  <td>{user.email}</td>
                  <td>{user.roles.map(role =>role.charAt(0).toUpperCase()+ role.slice(1)).join(', ')}</td> 
                </tr>
              )
            }
          </tbody>
        </Table>
      </>
    )
  }
}
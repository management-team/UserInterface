import * as React from 'react';
import { Table, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { ICognitoUser } from '../../../model/cognito-user.model';
import ViewUserModal from '../view-user-modal/view-user-modal.container';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { Link } from 'react-router-dom';
import { IManageInternalComponentProps } from './manage-internal.container';

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

export const sortTypes = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  FIRST_NAME_REVERSE: 'firstNameReverse',
  LAST_NAME_REVERSE: 'lastNameReverse',
  EMAIL_REVERSE: 'emailReverse',
  SORT_IMAGE: 'https://img.icons8.com/android/24/000000/sort-down.png',
  SORT_IMAGE_REVERSE: 'https://img.icons8.com/android/24/000000/sort-up.png',
  DEFAULT_SORT_IMAGE: 'https://img.icons8.com/android/24/000000/sort.png'
}

export class ManageInternalComponenet extends React.Component<IManageInternalComponentProps, any> {

  constructor(props: IManageInternalComponentProps) {
    super(props);
    this.state = {
      roleDropdownList: false,
      dropDownValue: this.props.currentRole,
      trackProps: 'sort',
      colOneSortImage: sortTypes.DEFAULT_SORT_IMAGE,
      colTwoSortImage: sortTypes.DEFAULT_SORT_IMAGE,
      colThreeSortImage: sortTypes.DEFAULT_SORT_IMAGE
    }
  }
  //re-render table only for the first time. Otherwise persist the prior results
  componentDidMount() {
    if (this.props.componentLoaded === false) {
      this.props.updateManageUsersTable(this.state.dropDownValue);
    }
    if (this.props.userTableSort !== "sorted") {
      console.log('set the SORT mannn')
      this.sort(this.props.userTableSort);
    }
  }

  displayUserModal = (selectedUser: ICognitoUser) => {
    this.props.selectUserForDisplay(selectedUser);
    this.props.toggleViewUserModal();
  }

  toggleDropdownList = () => {
    this.setState({
      roleDropdownList: !this.state.roleDropdownList
    });
  }

  updateDropdown = (option: string) => {
    this.props.updateManageUsersTable(option)
    this.sort('sorted')
  }

  //Sort the table by columns
  sort = (sortKey) => {

    //first Name
    if (sortKey === sortTypes.FIRST_NAME || sortKey === sortTypes.FIRST_NAME_REVERSE) {
      if (sortKey === this.state.trackProps || sortKey.includes('Reverse')) {
        sortKey = sortTypes.FIRST_NAME_REVERSE
        this.setState({ colOneSortImage: sortTypes.SORT_IMAGE_REVERSE })
      } else {
        this.setState({ colOneSortImage: sortTypes.SORT_IMAGE })
      }
    } else {
      this.setState({ colOneSortImage: sortTypes.DEFAULT_SORT_IMAGE })
    }
    //last name
    if (sortKey === sortTypes.LAST_NAME || sortKey === sortTypes.LAST_NAME_REVERSE) {
      if (sortKey === this.state.trackProps || sortKey.includes('Reverse')) {
        sortKey = sortTypes.LAST_NAME_REVERSE
        this.setState({ colTwoSortImage: sortTypes.SORT_IMAGE_REVERSE })
      } else {
        this.setState({ colTwoSortImage: sortTypes.SORT_IMAGE })
      }
    } else {
      this.setState({ colTwoSortImage: sortTypes.DEFAULT_SORT_IMAGE })
    }
    //email
    if (sortKey === sortTypes.EMAIL || sortKey === sortTypes.EMAIL_REVERSE) {
      if (sortKey === this.state.trackProps || sortKey.includes('Reverse')) {
        sortKey = sortTypes.EMAIL_REVERSE
        this.setState({ colThreeSortImage: sortTypes.SORT_IMAGE_REVERSE })
      } else {
        this.setState({ colThreeSortImage: sortTypes.SORT_IMAGE })
      }
    } else {
      this.setState({ colThreeSortImage: sortTypes.DEFAULT_SORT_IMAGE })
    }
    this.props.sortUsers(this.props.manageUsers, sortKey)
    this.setState({ trackProps: sortKey })
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
                {this.props.currentRole}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem >
                  <Link to={path + "/manage/all"}
                    className={`nav-link ${this.isActive('all')}`}
                    onClick={() => this.updateDropdown('all')}>All</Link></DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <Link to={path + "/manage/admin"}
                    className={`nav-link ${this.isActive('admin')}`}
                    onClick={() => this.updateDropdown('admin')}>Admin</Link></DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <Link to={path + "/manage/trainer"}
                    className={`nav-link ${this.isActive('trainer')}`}
                    onClick={() => this.updateDropdown('trainer')}>Trainer</Link></DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <Link to={path + "/manage/staging-manager"}
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
              <th className="pointer-table" onClick={() => this.sort(sortTypes.FIRST_NAME)}>First Name<img src={this.state.colOneSortImage} /> </th>
              <th className="pointer-table" onClick={() => this.sort(sortTypes.LAST_NAME)}>Last Name <img src={this.state.colTwoSortImage} /></th>
              <th className="pointer-table" onClick={() => this.sort(sortTypes.EMAIL)}>Email<img src={this.state.colThreeSortImage} /></th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.manageUsers.map((user) =>
                <tr key={user.email} className="rev-table-row" onClick={() => this.displayUserModal(user)}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(', ')}</td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </>
    )
  }
}
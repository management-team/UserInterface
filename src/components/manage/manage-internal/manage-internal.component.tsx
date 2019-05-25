import * as React from 'react';
import { Table } from 'reactstrap';
import { ICognitoUser } from '../../../model/cognito-user.model';
import ViewUserModal from '../view-user-modal/view-user-modal.container';


export interface IManageInternalComponentProps {
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
  }
  

  render() {
    return (
        <Table striped id="manage-users-table">
        <ViewUserModal/>
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
        
    )
  }
}
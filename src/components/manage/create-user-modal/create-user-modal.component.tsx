import * as React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Input,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { ICreateUserModal } from './create-user-modal.container';
import { IUser } from '../../../model/user.model';


const inputNames = {
  EMAIL: 'NEW_USER_EMAIL',
  FIRST_NAME: 'NEW_USER_FIRST_NAME',
  LAST_NAME: 'NEW_USER_LAST_NAME',
  PHONE: 'NEW_USER_PHONE'
}


export class CreateUserModal extends React.Component<ICreateUserModal, any> {
  constructor(props: ICreateUserModal) {
    super(props);
  }

  componentDidMount() {
    this.props.updateLocations();
  }

  updateNewUserInfo = (e: React.FormEvent) => {
    let updatedNewUser = this.props.createUser.newUser;

    const target = e.target as HTMLSelectElement;
    switch (target.name) {
      case inputNames.EMAIL:
        updatedNewUser = {
          ...updatedNewUser,
          email: target.value
        }
        break;
      case inputNames.FIRST_NAME:
        updatedNewUser = {
          ...updatedNewUser,
          firstName: target.value
        }
        break;
      case inputNames.LAST_NAME:
        updatedNewUser = {
          ...updatedNewUser,
          lastName: target.value
        }
        break;
      case inputNames.PHONE:
        updatedNewUser = {
          ...updatedNewUser,
          phoneNumber: target.value
        }
        break;
      default:
        break;
    }
    const tempUser: IUser = {
      email: updatedNewUser.email,
      userId: 0,
      firstName: updatedNewUser.firstName,
      lastName: updatedNewUser.lastName,
      phoneNumber: updatedNewUser.phoneNumber,
      trainingAddress: updatedNewUser.trainingAddress,
      personalAddress: {
        addressId: 0,
        street: '',
        alias: '',
        city: '',
        country: '',
        state: '',
        zip: ''
      },
      userStatus: {
        statusId: 0,
        generalStatus: '',
        specificStatus: '',
        virtual: false,
      },
      roles: [updatedNewUser.role],
    }
    this.props.updateNewUser(tempUser)
  }

  saveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('saving')
    const tempUser: IUser = {
      email: this.props.createUser.newUser.email,
      userId: 0,
      firstName: this.props.createUser.newUser.firstName,
      lastName: this.props.createUser.newUser.lastName,
      phoneNumber: this.props.createUser.newUser.phoneNumber,
      trainingAddress: this.props.createUser.newUser.trainingAddress,
      personalAddress: {
        addressId: 0,
        street: '',
        alias: '',
        city: '',
        country: '',
        state: '',
        zip: ''
      },
      userStatus: {
        statusId: 2,
        generalStatus: 'Training',
        specificStatus: 'Training',
        virtual: false
      },
      roles: [this.props.createUser.newUser.role],
    }
    this.props.saveUser(tempUser);
  }



  render() {
    const { createUser, addresses, cohorts } = this.props;
    return (
      <Modal isOpen={this.props.createUser.enabled} id="futurafont">
        <form onSubmit={this.saveNewUser}>
          <ModalHeader className="rev-background-color">Create User</ModalHeader>
          <ModalBody>
            <div className="responsive-modal-row">
              <Input name={inputNames.FIRST_NAME}
                className="responsive-modal-row-item"
                placeholder="First Name"
                onChange={this.updateNewUserInfo}
                value={createUser.newUser.firstName}
                valid={!!createUser.newUser.firstName}
                invalid={!createUser.newUser.firstName} />

              <Input name={inputNames.LAST_NAME}
                className="responsive-modal-row-item"
                placeholder="Last Name"
                onChange={this.updateNewUserInfo}
                value={createUser.newUser.lastName}
                valid={!!createUser.newUser.lastName}
                invalid={!createUser.newUser.lastName} />
            </div>
            <div className="responsive-modal-row">
              {/* <InputGroup className="responsive-modal-row-item">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Email</InputGroupText>
                </InputGroupAddon> */}
              <Input className="responsive-modal-row-item"
                name={inputNames.EMAIL}
                onChange={this.updateNewUserInfo}
                value={createUser.newUser.email}
                valid={!!createUser.newUser.email}
                invalid={!createUser.newUser.email}
                placeholder="Email" />
              <Input className="responsive-modal-row-item"
                name={inputNames.PHONE}
                onChange={this.updateNewUserInfo}
                value={createUser.newUser.phoneNumber}
                valid={!!createUser.newUser.phoneNumber}
                invalid={!createUser.newUser.phoneNumber}
                placeholder="Phone Number" />
            </div>
            <div className="responsive-modal-row">
              {/*<InputGroup >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Phone Number</InputGroupText>
                </InputGroupAddon> */}
              <Dropdown color="success" className="responsive-modal-row-item rev-btn"
                isOpen={this.props.createUser.locationDropdownActive}
                toggle={this.props.toggleLocationDropdown}>
                <DropdownToggle caret>
                  {createUser.newUser.trainingAddress.alias || 'Location'}
                </DropdownToggle>
                <DropdownMenu>
                  {
                    addresses.trainingAddresses.length === 0
                      ? <>
                        <DropdownItem>Unable To Find Any Locations</DropdownItem>
                        <DropdownItem divider />
                      </>
                      : addresses.trainingAddresses.map(location =>
                        <DropdownItem key={location.addressId} onClick={() => this.props.updateNewUserLocation(location)}>{location.alias}</DropdownItem>
                      )
                  }
                </DropdownMenu>
              </Dropdown>

              <Dropdown color="success" className="responsive-modal-row-item rev-btn"
                isOpen={this.props.createUser.roleDropdownActive}
                toggle={this.props.toggleRoleDropdown}>
                <DropdownToggle caret>
                  {createUser.newUser.dropdownRole || 'Role'}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => this.props.updateNewUserRole('admin', 'Admin')}>Admin</DropdownItem>
                  <DropdownItem onClick={() => this.props.updateNewUserRole('staging-manager', 'Staging Manager')}>Staging Manager</DropdownItem>
                  <DropdownItem onClick={() => this.props.updateNewUserRole('trainer', 'Trainer')}>Trainer</DropdownItem>
                  <DropdownItem onClick={() => this.props.updateNewUserRole('associate', 'Associate')}>Associate</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Dropdown color="success" className="responsive-modal-row-item rev-btn"
                isOpen={this.props.createUser.cohortDropdownActive}
                toggle={this.props.toggleCohortDropdown}>
                <DropdownToggle caret>
                  {createUser.newUser.cohort || 'Cohort'}
                </DropdownToggle>
                <DropdownMenu>
                  {
                    cohorts.cohorts.length === 0
                      ? <>
                        <DropdownItem>Unable To Find Any Cohorts</DropdownItem>
                        <DropdownItem divider />
                      </>
                      : cohorts.cohorts.map(cohort =>
                        <DropdownItem key={cohort.cohortId} onClick={() => this.props.updateNewUserCohort(cohort.cohortName)}>{cohort.cohortName}</DropdownItem>
                      )
                  }
                </DropdownMenu>
              </Dropdown>
            </div>
          </ModalBody>
          <ModalFooter id="create-user-modal-footer">
            <Button type="submit" className="rev-btn">Save</Button>{' '}
            <Button color="secondary" onClick={this.props.toggleModal}>Cancel</Button>
          </ModalFooter>
        </form>
      </Modal>

    );
  }
}


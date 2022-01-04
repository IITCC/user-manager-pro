import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  set,
  toJS,
} from "mobx";
import toast from "react-hot-toast";
import API from "../api"
import { resolvePath } from "react-router";

interface Contact {
  name: string;
  number: string;
  id: string;
  photo: string;
}

const saveStore = (_this: any) => {
  const storedJson = localStorage.getItem("phonebookStore");
  if (storedJson) {
    set(_this, JSON.parse(storedJson));
  }

  autorun(() => {
    const value = toJS(_this);
    localStorage.setItem("phonebookStore", JSON.stringify(value));
  });
};

class Store {
  public contacts: Contact[] = [];
  public filterString = "";

  constructor() {
    makeObservable(this, {
      contacts: observable,
      filterString: observable,
      addContact: action,
      removeContact: action,
      updateContact: action,
      updateFilter: action,
      contactCount: computed,
      filteredContacts: computed,
    });
     
      saveStore(this);
  }

   loadContacts = () => {

    if(this.contacts.length > 0) {
      return;
    }

    API.get(`users`)
      .then(res => {
        if(res.data) {
          for(let i = 0; i < res.data.length; i++) {
            this.contacts.push({
            name: res.data[i].firstName,
            number: res.data[i].email,
            photo: `https://ui-avatars.com/api/?name=${res.data[i].email}&length=1&background=random&size=262`,
            id: res.data[i].id,
            });
          }
        }
      });
   }

  addContact = ({ name, number }: { name: string; number: string }) => {
    this.contacts.push({
      name,
      number,
      photo: `https://ui-avatars.com/api/?name=${name}&length=1&background=random&size=262`,
      id: `${this.contacts.length + 1}`,
    });
    toast.success("Contact added");
  };

  removeContact = (id: string) => {
    this.contacts = this.contacts.filter((e) => e.id !== id);
    toast.success("Contact deleted");
  };

  findContact = (id: string) => {
    return this.contacts.find((e) => e.id === id);
  };

  updateContact = (id: string, payload: Contact) => {
    // Find index
    let index = this.contacts.findIndex((e) => e.id === id);
    this.contacts[index] = payload;
    toast.success("Contact updated");
  };

  updateFilter = (filter: string) => {
    this.filterString = filter;
  };

  get contactCount() {
    return this.contacts.length;
  }

  get filteredContacts() {
    // FIlter
    let filtered = this.contacts.filter((contact) =>
      contact.name.match(new RegExp(this.filterString, "i"))
    );

    // Sort
    filtered = filtered.sort((a, b) => (Number(a.id) < Number(b.id) ? 1 : -1));

    return filtered;
  }
}

export default new Store();

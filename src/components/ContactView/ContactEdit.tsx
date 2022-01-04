import { observer } from "mobx-react";
import { useState } from "react";
import { MdOutlinePhone, MdPersonOutline } from "react-icons/md";
import { useParams } from "react-router-dom";
import store from "../../store";

interface Props {}

const ContactEdit = (props: Props) => {
  const params = useParams();
  const contact = store.findContact(params.id!);

  const [name, setName] = useState(contact!.name);
  const [number, setNumber] = useState(contact!.number);
  const [last, setLast] = useState(contact!.last);
  const [dob, setDob] = useState(contact!.dob);

  const handleSubmit = () => {
    store.updateContact(contact!.id, {
      name,
      number,
      id: contact!.id,
      photo: contact!.photo,
      last,
      dob,
    });
  };

  return (
    <div>
      <form
        className="max-w-[520px]"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex gap-4 my-8 w-full items-center">
          <MdPersonOutline size={28} className="opacity-[0.56]" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-b w-full focus:outline-none leading-8"
            placeholder="First name"
          />
        </div>

        <div className="flex gap-4 my-8 w-full items-center">
          <MdPersonOutline size={28} className="opacity-[0.56]" />
          <input
            value={last}
            onChange={(e) => setLast(e.target.value)}
            className="border-b w-full focus:outline-none leading-8"
            placeholder="Last name"
          />
        </div>

        <div className="flex gap-4 my-8 w-full items-center">
          <MdOutlinePhone size={28} className="opacity-[0.56]" />
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="border-b w-full focus:outline-none leading-8"
            placeholder="Phone number"
          />
        </div>

        <div className="flex gap-4 my-8 w-full items-center">
          <MdPersonOutline size={28} className="opacity-[0.56]" />
          <input
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="border-b w-full focus:outline-none leading-8"
            placeholder="Date of birth"
          />
        </div>

        <div className="">
          <button
            type="submit"
            disabled={name === contact?.name && number === contact?.number && last === contact?.last && dob === contact?.dob}
            className="h-10 bg-[#1a73e8] text-white px-8 rounded disabled:grayscale"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default observer(ContactEdit);

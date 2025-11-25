import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Loader from 'src/UI/Loader/Loader.js';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { addRoles } from '../../slices/roles';
import { addGroups } from '../../slices/groups';
import EditRegisterBuilder from '../pages/Auth/Register/EditBuilderGroup';

function EditBuilder() {
  const { BuilderId } = useParams();
  const { method } = useAuth();

  const dispatch = useDispatch();
  const [isAdmin, setAdmin] = useState(false);
  let group = useSelector((state) => state.group.groupDataById);
  useEffect(() => {
    dispatch(addRoles());
    dispatch(addGroups());
  }, []);
  useEffect(() => {}, [group]);

  const handleChange = () => {
    setAdmin(!isAdmin);
  };

  return (
    <>
      <Helmet>
        <title>Edit Builder</title>
      </Helmet>

      {_.isEmpty(group) && <Loader />}
      {method === 'JWT' && BuilderId !== '' && !_.isEmpty(group) && (
        <EditRegisterBuilder group={group} handleAdmin={handleChange} />
      )}
    </>
  );
}

export default EditBuilder;

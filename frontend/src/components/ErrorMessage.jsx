import PropTypes from 'prop-types';

const ErrorMessage = ({ msg, msgs }) => {
    return (
        <div className='bg-error rounded-md p-2'>
            {
                msg
                    ? <>{ msg }</>
                    : <ul>
                        {msgs.map((msg, index) => <li key={index} className='list-disc ml-4'>{msg}</li>)}
                    </ul>
            }
        </div>
    );
};

ErrorMessage.propTypes = {
    msgs: PropTypes.node,
    msg: PropTypes.node
};

export default ErrorMessage;

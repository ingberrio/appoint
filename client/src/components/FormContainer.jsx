import PropTypes from 'prop-types';

const FormContainer = ({ children }) => {
    return (
        <>
            {children}
        </>
    );
};

// Always provided with a children prop adn cand be rendered
FormContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FormContainer;

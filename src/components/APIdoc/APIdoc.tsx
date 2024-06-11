import Navbar from 'components/Navbar/Navbar';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import React, {Component} from 'react';

import SwaggerUi from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';

class SwaggerUI extends Component {

    componentDidMount() {
        SwaggerUi({
            dom_id: '#swaggerContainer',
            url: 'http://localhost:8000/api/v1/docsFile'
        });
    }

    render() {
        return (
            <NavbarWrapper>
                <Navbar/>
                <div id="swaggerContainer" />
            </NavbarWrapper>
        );
    }
}

export default SwaggerUI;
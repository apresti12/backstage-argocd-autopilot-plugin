import React, {useEffect, useState} from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
// import Button from "./CustomButtonComponent";
import {useApi} from "@backstage/core-plugin-api";
import {argocdAutopilotApiRef} from "../../api";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from '@mui/material/FormControl';
// import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { InputLabel} from "@material-ui/core";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Bootstrap from './components/bootstrap'
import AddApp from './components/newApp'
import NewProject from './components/newProject'

export const ExampleComponent = () => {
    const { entity } = useEntity();
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('N/A');
    const [error, setError] = useState<boolean>(false);
    const [action, setAction] = React.useState('');
    const [bootstrapFormVisible, setBootstrapFormVisible] = useState(false);
    const [newAppFormVisible, setnewAppFormVisible] = useState(false);
    const [newProjectFormVisible, setnewProjectFormVisible] = useState(false);

    useEffect(() => {
        action === 'bootstrap' ? setBootstrapFormVisible(true): setBootstrapFormVisible(false)
        action === 'app-add' ? setnewAppFormVisible(true): setnewAppFormVisible(false)
        action === 'project-add' ? setnewProjectFormVisible(true): setnewProjectFormVisible(false)
    },[action])

    const myPluginApi = useApi(argocdAutopilotApiRef);

    const handleChange = (event: SelectChangeEvent) => {
        setAction(event.target.value as string);
    };

    async function getObjects() {
        try {
            if(!loading) {
                setLoading(true)
            }
            const resp = await myPluginApi.PostArgoApi(action);
            setStatus(resp.status);
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    return (<>
        <h1>
            ArgoCD Autopilot {entity.metadata.name} Plugin
        </h1>
        <Box sx={{ minWidth: 120 }}>
            <FormControl >
                <InputLabel id="argo-select-label">Action</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="select-action"
                    value={action}
                    label="action"
                    onChange={handleChange}
                >
                    <MenuItem value={'bootstrap'}>Bootstrap</MenuItem>
                    <MenuItem value={'app-add'}>Add App</MenuItem>
                    <MenuItem value={'project-add'}>Add Project</MenuItem>
                    <MenuItem value={'test'}>Test</MenuItem>
                </Select>
            </FormControl>
        </Box>
        <form>
        <Grid container alignItems="flex-start" direction="column">
            <Grid item>
                <FormControl fullWidth>
                    <TextField
                        fullWidth
                        id="git-repo-org"
                        name="Git Repo Org"
                        label="Github Organization"
                        type="text"
                        // value={formValues.age}
                        // onChange={handleInputChange}
                        />
                    <TextField
                        id="repo-name"
                        name="Repo Name"
                        label="Repo Name"
                        type="text"
                        // value={formValues.age}
                        // onChange={handleInputChange}
                    />
                    {bootstrapFormVisible && <Bootstrap />}
                    {newAppFormVisible && <AddApp />}
                    {newProjectFormVisible && <NewProject />}

                    </FormControl>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={getObjects}>{loading ? <>Loading..</> : <>Submit</>}</Button>
                </Grid>
                </Grid>
            </form>
        <div>
            <h3>Status: {loading ? <>N/A</> : status}</h3>
        </div>
    </>);
}
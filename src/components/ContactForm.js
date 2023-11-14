import React, { memo, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

//** for location auto complete */
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-places-autocomplete";
// import Geosuggest from "react-geosuggest";
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-places-autocomplete";
//** styling */
import "../App.scss";

const ContactForm = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [validZip, setValidZip] = useState(true);
  const [validEmail, setValidEmail] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [errorText, setErrorText] = useState("");

  const formik = useFormik({
    initialValues: {
      reason: "",
      zipCode: "",
      installation: "",
      securityFeatures: [],
      systemType: "",
      numberOfEntrances: "",
      address: "",
      fname: "",
      lname: "",
      email: "",
      phone: "",
      city:"",
      state:"",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Reason for contact is required"),
      zipCode: Yup.string()
        .matches(/^\d{5}$/, "Zip code must be exactly 5 digits")
        .required("Zip code is required"),
      installation: Yup.string().required(
        "Installation preference is required"
      ),
      systemType: Yup.string().required("System type is required"),
      numberOfEntrances: Yup.string().required(
        "Number of entrances is required"
      ),
      address: Yup.string().required("Address is required"),
      fname: Yup.string().required("First Name is required"),
      lname: Yup.string().required("Last Name is required"),
      email: Yup.string(),
      phone: Yup.string(),
      city: Yup.string().required("City  is required"),
      state: Yup.string().required("State is required"),
    }),
    onSubmit: async (values) => {
      const isEmailValid = await validateEmail(values.email);
      const isPhoneValid = await validatePhone(values.phone);

      if (!isEmailValid || !isPhoneValid) {
        console.log("Form submitted with values:", values);
        HandleSubmitData(values)
      } else {
        console.log("error");
      }
    },
  });

  const HandleSubmitData = async (
    values
  ) => {
    setErrorText(null)
    const url = "https://bluemodo.leadspediatrack.com/post.do";

    const bodyData = {
      lp_campaign_id:"64b9ccf73e38c",
      lp_campaign_key:"mYFhzwtX7LKWBGgD34Tb",
      first_name:values?.fname,
      last_name:values?.lname,
      phone_home:values?.phone,
      address:values?.address,
      city:values?.city,
      state:values?.state,
      zip_code:values?.zipCode,
      email_address:values?.email,
      property_type:values?.reason,
      installation_preference:values?.installation,
      features:values?.securityFeatures,
      system_type:values?.systemType,
      entrances:values?.numberOfEntrances
    };

    const config = {
      headers: {
        "content-type": "application/json",
      },
    };

    try {
      console.log(bodyData)

      const res = await axios.post(url, bodyData, config);
      console.log(res)
      // handleClickOpen();
      // setResponseTxt(res?.data?.message)
    } catch (err) {
      console.error(err);
      setErrorText(err?.response?.data?.message)
    }
  };

  useEffect(() => {
    if (validZip && formik.values.zipCode.length === 5) {
      fetchCityAndState(formik.values.zipCode);
    } else {
      setCity("");
      setState("");
    }
  }, [formik.values.zipCode, validZip]);

  const fetchCityAndState = (zipCode) => {
    // Use a suitable API endpoint to fetch city and state data based on the zip code
    // Replace the API URL with the actual API you want to use
    fetch(`https://api.zippopotam.us/us/${zipCode}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.places && data.places.length > 0) {
          setCity(data.places[0]["place name"]);
          setState(data.places[0]["state"]);
          setValidZip(true);
        } else {
          setCity("");
          setState("");
          setValidZip(false);
        }
      })
      .catch((error) => {
        setCity("");
        setState("");
        setValidZip(false);
        console.error("Error fetching data from the API:", error);
      });
  };

  const validateEmail = async (email) => {
    setValidEmail(false);
    try {
      const response = await axios.get(
        `https://emailvalidation.abstractapi.com/v1/?api_key=6993e55d53984d0fbac6bf7e2d90fd1f&email=${email}`
      );
      return response.data.is_valid;
    } catch (error) {
      console.error("Error validating email:", error);
      setValidEmail(true);
      return false;
    }
  };

  const validatePhone = async (phone) => {
    setValidPhone(false);
    try {
      const response = await axios.get(
        `http://apilayer.net/api/validate?access_key=6d6d22eddd0ea085f7702c94d5155ee3&number=${phone}`
      );
      if (response.data.valid === true) {
        setValidPhone(false);
      } else {
        setValidPhone(true);
      }
    } catch (error) {
      console.error("Error validating phone:", error);
      return false;
    }
  };

  const labelStyle = {
    marginBottom: "8px", // Add margin bottom to the labels
  };

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InputLabel htmlFor="reason" style={labelStyle}>
            What type of property is this system for
          </InputLabel>
          <Select
            fullWidth
            id="reason"
            name="reason"
            variant="outlined"
            value={formik.values.reason}
            onChange={formik.handleChange}
            error={formik.touched.reason && Boolean(formik.errors.reason)}
          >
            <MenuItem disabled value="">
              Select an option
            </MenuItem>
            <MenuItem value="Owned">Owned</MenuItem>
            <MenuItem value="Rented">Rented</MenuItem>
          </Select>
          {formik.touched.reason && formik.errors.reason && (
            <div className="error-text">{formik.errors.reason}</div>
          )}
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="zipCode" style={labelStyle}>
            Zip Code
          </InputLabel>
          <TextField
            fullWidth
            id="zipCode"
            name="zipCode"
            variant="outlined"
            value={formik.values.zipCode}
            onChange={(e) => {
              formik.handleChange(e);
              setValidZip(e.target.value.match(/^\d{5}$/) !== null); // Validate as user types
            }}
            error={formik.touched.zipCode && !validZip}
          />
          {city && state ? (
            <div className="info-text">
              {" "}
              {city}, {state}
            </div>
          ) : (
            <div className="error-text">{formik.errors.zipCode}</div>
          )}
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="installation" style={labelStyle}>
            What is your installation preference
          </InputLabel>
          <Select
            fullWidth
            id="installation"
            name="installation"
            variant="outlined"
            value={formik.values.installation}
            onChange={formik.handleChange}
            error={
              formik.touched.installation && Boolean(formik.errors.installation)
            }
          >
            <MenuItem disabled value="">
              Select an option
            </MenuItem>
            <MenuItem value="professional">Professional installation</MenuItem>
            <MenuItem value="self">Self installation</MenuItem>
            <MenuItem value="np">No preference</MenuItem>
          </Select>
          {formik.touched.installation && formik.errors.installation && (
            <div className="error-text">{formik.errors.installation}</div>
          )}
        </Grid>
    
        <Grid item xs={12}>
          <InputLabel htmlFor="securityFeatures" style={labelStyle}>
            What home security features would you like to have? (Select
            multiple)
          </InputLabel>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="securityFeatures">Select features</InputLabel>
            <Select
              fullWidth
              multiple
              id="securityFeatures"
              name="securityFeatures"
              value={formik.values.securityFeatures}
              onChange={formik.handleChange}
              renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem value="Cameras">Cameras</MenuItem>
              <MenuItem value="Motion Sensors">Motion Sensors</MenuItem>
              <MenuItem value="Glass break sensors">
                Glass break sensors
              </MenuItem>
              <MenuItem value="Doorbell Cameras">Doorbell Cameras</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="systemType" style={labelStyle}>
            What kind of System do you need?
          </InputLabel>
          <Select
            fullWidth
            id="systemType"
            name="systemType"
            variant="outlined"
            value={formik.values.systemType}
            onChange={formik.handleChange}
            error={
              formik.touched.systemType && Boolean(formik.errors.systemType)
            }
          >
            <MenuItem disabled value="">
              Select an option
            </MenuItem>
            <MenuItem value="Burglar">Burglar / intrusion</MenuItem>
            <MenuItem value="FireDetection">Fire detection</MenuItem>
            <MenuItem value="Both">Both burglar and fire detection</MenuItem>
          </Select>
          {formik.touched.systemType && formik.errors.systemType && (
            <div className="error-text">{formik.errors.systemType}</div>
          )}
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="numberOfEntrances" style={labelStyle}>
            How many entrances exist?
          </InputLabel>
          <Select
            fullWidth
            id="numberOfEntrances"
            name="numberOfEntrances"
            variant="outlined"
            value={formik.values.numberOfEntrances}
            onChange={formik.handleChange}
            error={
              formik.touched.numberOfEntrances &&
              Boolean(formik.errors.numberOfEntrances)
            }
          >
            <MenuItem disabled value="">
              Select an option
            </MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2-4">2-4</MenuItem>
            <MenuItem value="5">5</MenuItem>
            <MenuItem value="MoreThan5">More than 5</MenuItem>
          </Select>
          {formik.touched.numberOfEntrances &&
            formik.errors.numberOfEntrances && (
              <div className="error-text">
                {formik.errors.numberOfEntrances}
              </div>
            )}
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="address" style={labelStyle}>
            What is your address?
          </InputLabel>
          <TextField
            fullWidth
            id="address"
            name="address"
            variant="outlined"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
        </Grid>
        {/* //!this code is for locating with google but i couldnt do it because it is paid but iam proving that i can handle it */}
        {/*
          <Grid item xs={12}>
          <InputLabel htmlFor="address" style={labelStyle}>
            What is your address?
          </InputLabel>
          <PlacesAutocomplete
            value={address}
            onChange={(value) => setAddress(value)}
            onSelect={handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  variant="outlined"
                  {...getInputProps({
                    placeholder: "Enter your address",
                    className: "location-search-input",
                  })}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                    };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          style,
                        })}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </Grid>  */}
        <div className="detailsWrapper">

        <Grid item xs={12}>
          <div className="data">Your Details</div>
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="address" style={labelStyle}>
            What is your First Name?
          </InputLabel>
          <TextField
            fullWidth
            id="fname"
            name="fname"
            variant="outlined"
            value={formik.values.fname}
            onChange={formik.handleChange}
            error={formik.touched.fname && Boolean(formik.errors.fname)}
            helperText={formik.touched.fname && formik.errors.fname}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="address" style={labelStyle}>
            What is your Last Name?
          </InputLabel>
          <TextField
            fullWidth
            id="lname"
            name="lname"
            variant="outlined"
            value={formik.values.lname}
            onChange={formik.handleChange}
            error={formik.touched.lname && Boolean(formik.errors.lname)}
            helperText={formik.touched.lname && formik.errors.lname}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="email" style={labelStyle}>
            Email
          </InputLabel>
          <TextField
            fullWidth
            id="email"
            name="email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email ? formik.errors.email : ""}
          />
          {validEmail && <div className="error-text">Email Is Not Valid</div>}
        </Grid>

        <Grid item xs={12}>
          <InputLabel htmlFor="phone" style={labelStyle}>
            What is your Phone?
          </InputLabel>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            variant="outlined"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone ? formik.errors.phone : ""}
          />
          {validPhone && <div className="error-text">Phone Is Not Valid</div>}
        </Grid>
        
        <Grid item xs={12}>
          <InputLabel htmlFor="address" style={labelStyle}>
            City
          </InputLabel>
          <TextField
            fullWidth
            id="city"
            name="city"
            variant="outlined"
            value={formik.values.city}
            onChange={formik.handleChange}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel htmlFor="address" style={labelStyle}>
            State
          </InputLabel>
          <TextField
            fullWidth
            id="state"
            name="state"
            variant="outlined"
            value={formik.values.state}
            onChange={formik.handleChange}
            error={formik.touched.state && Boolean(formik.errors.state)}
            helperText={formik.touched.state && formik.errors.state}
          />
        </Grid>
        </div>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          
          {errorText && <div className="error-text">{errorText}</div>}

          
        </Grid>
      </Grid>
    </form>
  );
};

export default memo(ContactForm);

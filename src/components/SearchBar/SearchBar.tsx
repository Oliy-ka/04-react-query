import styles from "./SearchBar.module.css"
import { Formik, Form, Field } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";


interface SearchBarProps{
    onSubmit: (newQuery: string) => void;
}

interface SearchBarValues {
    query: string;
}

const initialValues: SearchBarValues = {
    query: "",
};

const SearchBarSchema = Yup.object().shape({
  query: Yup.string().required("Query is required"),
});


export default function SearchBar({ onSubmit }: SearchBarProps) {
    const handleSubmit = (
        values: SearchBarValues,
        actions: FormikHelpers<SearchBarValues>
    ) => {
        onSubmit(values.query);;
        actions.resetForm();
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <a className={styles.link} href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
                    Powered by TMDB
                </a>
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={SearchBarSchema}>
                    {({ errors, touched }) => (
                    <Form className={styles.form}>
                    <Field className={styles.input}
                        type="text"
                        name="query"
                        autoComplete="off"
                        placeholder="Search movies..."
                        autoFocus
                    />
                        {touched.query && errors.query && (<span className={styles.error}>{errors.query}</span>)}
                        <button className={styles.button} type="submit">
                            Search
                        </button>
                    </Form>
                    )}
                </Formik>
            </div>
        </header>
    );
}
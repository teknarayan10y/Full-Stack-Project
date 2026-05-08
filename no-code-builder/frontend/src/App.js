import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ComponentProvider } from './context/ComponentContext';
import { BuilderProvider } from './context/BuilderContext';
import { TemplateProvider } from './context/TemplateContext';
import { FormProvider } from './context/FormContext';
import { ThemeProvider } from './context/ThemeContext';
import { FileUploadProvider } from './context/FileUploadContext';
import GlobalStyles from './styles/GlobalStyles';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import Preview from './pages/Preview';
import Profile from './pages/Profile';
import Templates from './pages/Templates';
import FileUpload from './pages/FileUpload';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/ui/PrivateRoute';
import Navbar from './components/ui/Navbar';

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <Router>
        <AuthProvider>
        <ProjectProvider>
          <ComponentProvider>
            <TemplateProvider>
              <FormProvider>
                <FileUploadProvider>
                  <DndProvider backend={HTML5Backend}>
                    <BuilderProvider>
                    <div className="App">
                      <Navbar />
                      <div className="container">
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/dashboard" element={
                            <PrivateRoute>
                              <Dashboard />
                            </PrivateRoute>
                          } />
                          <Route path="/builder/:projectId" element={
                            <PrivateRoute>
                              <Builder />
                            </PrivateRoute>
                          } />
                          <Route path="/preview/:projectId" element={
                            <PrivateRoute>
                              <Preview />
                            </PrivateRoute>
                          } />
                          <Route path="/profile" element={
                            <PrivateRoute>
                              <Profile />
                            </PrivateRoute>
                          } />
                          <Route path="/templates" element={
                            <PrivateRoute>
                              <Templates />
                            </PrivateRoute>
                          } />
                          <Route path="/files" element={
                            <PrivateRoute>
                              <FileUpload />
                            </PrivateRoute>
                          } />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </div>
                    </BuilderProvider>
                  </DndProvider>
                </FileUploadProvider>
              </FormProvider>
            </TemplateProvider>
          </ComponentProvider>
        </ProjectProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

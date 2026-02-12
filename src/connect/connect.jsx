import React from 'react';

export function Connect() {
  return (
    <main>
        <div class="page-content">
            <div class = "notebook_bar">
                <li><a href="notes.html" class = "bar-item-button">Notebook1</a></li>
                <li><a href="#" class = "bar-item-button">Notebook2</a></li>
                <li><a href="#" class = "bar-item-button">Notebook3</a></li>
                <button class="new_notebook" type="button">New Notebook</button>
            </div>  
        
        
            <div class="connect-page-content">
                <div class="content">
                    <img src="images/download.png" alt="Blue Links"/>
                    <div class="icon-item">
                        <img src="images/starryexampleimg.png" alt="Blue Links"/>
                        <h4>Starry Night</h4>
                    </div>
                    <div class="icon-item">
                        <img src="images/documenticon.png" alt="Document Icon"/>
                        <h4>Notebook1</h4>
                    </div>
                    <div class="icon-item">
                        <img src="images/documenticon.png" alt="Document Icon"/>
                        <h4>Sticky Note</h4>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}
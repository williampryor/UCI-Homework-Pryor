from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import requests
import pymongo

def init_browser():
    executable_path = {"executable_path": "chromedriver.exe"}
    return Browser('chrome', **executable_path, headless=False)

def scrape():
    browser = init_browser()
    mars_dict ={}

    nasa_news_url = 'https://mars.nasa.gov/news/'
    browser.visit(nasa_news_url)
    html = browser.html
    news_soup = BeautifulSoup(html, 'html.parser')

    news_title = news_soup.find_all('div', class_='content_title')[0].text
    news = news_soup.find_all('div', class_='article_teaser_body')[0].text

    print(news_title)
    print("--------------------------------------------------------------------")
    print(news)

#scrape the url that links to the featured image using beautiful soup variable
    
    jpl_img_url = 'https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA16225_hires.jpg'

    soupy_img = BeautifulSoup(html, 'html.parser')
    img_path = soupy_img.find_all('img')[3]["src"]
    featured_image_url = jpl_img_url + img_path
    print(featured_image_url)

    facts_link = 'https://space-facts.com/mars/'
    fact_out = pd.read_html(facts_link)
    fact_out

#Create a dataframe to visualize the values from the facts link

    fact_df = fact_out[2]
    fact_df

#name the columns to better names
    fact_df.columns = ["Description", "Mars"]
    fact_df

    #convert mars fact_df to html table
    html_table = fact_df.to_html()
    html_table.replace('\n', '')
#Mars Hemisphere
    usgs_url = 'https://astrogeology.usgs.gov'
    hemispheres_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'

    browser.visit(hemispheres_url)

    hemispheres_html = browser.html

    hemispheres_soup = BeautifulSoup(hemispheres_html, 'html.parser')

    every_mars_hemisphere = hemispheres_soup.find('div', class_='collapsible results')
    mars_hemispheres = every_mars_hemisphere.find_all('div', class_='item')

    hemisphere_image_urls = []

#loop through hemisphere data
    for i in mars_hemispheres:
    
        hemisphere = i.find('div', class_="description")
        title = hemisphere.h3.text
        
        #scrape the img url from the page
        hemisphere_url = hemisphere.a["href"]    
        browser.visit(usgs_url + hemisphere_url)
        
        html = browser.html
        img_soup = BeautifulSoup(html, 'html.parser')
        
        image_link = img_soup.find('div', class_='downloads')
        
        #store 'li' and the 'href' from html code from webpage into a variable to invoke it later
        img_url = image_link.find('li').a['href']

        #store title and url in a dictionary
        image_dict = {}
        image_dict['title'] = title
        image_dict['img_url'] = img_url
        hemisphere_image_urls.append(image_dict)

        print(hemisphere_image_urls)

    mars_dict = {
        "news_title": news_title,
        "news": news,
        "featured_image_url": featured_image_url,
        "fact_table": str(html_table),
        "hemisphere_images": hemisphere_image_urls
    }

    return mars_dict